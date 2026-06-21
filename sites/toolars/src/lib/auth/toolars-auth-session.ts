import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const TOOLARS_SESSION_COOKIE_NAME = "toolars_session";

export interface ToolarsAuthSession {
  accountEmail: string | null;
  accountId: string;
  expiresAt: string;
  issuedAt: string;
  sessionId: string;
}

export interface CreateToolarsAuthSessionCookieOptions {
  accountEmail?: string | null;
  accountId: string;
  expiresAt?: string;
  issuedAt?: string;
  maxAgeSeconds?: number;
  secret?: string;
  secure?: boolean;
  sessionId?: string;
}

export interface ResolveToolarsAuthSessionOptions {
  now?: () => Date;
  secret?: string;
}

interface ToolarsAuthSessionPayload extends ToolarsAuthSession {
  version: 1;
}

const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export function createToolarsAuthSessionCookie(options: CreateToolarsAuthSessionCookieOptions) {
  const issuedAt = options.issuedAt ?? new Date().toISOString();
  const expiresAt = options.expiresAt ?? buildExpiresAt(issuedAt, options.maxAgeSeconds ?? DEFAULT_SESSION_TTL_SECONDS);
  const maxAgeSeconds = Math.max(0, Math.floor((Date.parse(expiresAt) - Date.parse(issuedAt)) / 1000));
  const session: ToolarsAuthSession = {
    accountEmail: normalizeAccountEmail(options.accountEmail),
    accountId: normalizeAccountId(options.accountId),
    expiresAt,
    issuedAt,
    sessionId: normalizeSessionId(options.sessionId ?? `sess_${randomUUID()}`)
  };
  const payload: ToolarsAuthSessionPayload = {
    ...session,
    version: 1
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signSessionPayload(encodedPayload, getSessionSecret(options.secret));
  const cookieParts = [
    `${TOOLARS_SESSION_COOKIE_NAME}=${encodedPayload}.${signature}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`
  ];

  if (options.secure ?? shouldUseSecureCookie()) {
    cookieParts.push("Secure");
  }

  return {
    cookie: cookieParts.join("; "),
    session
  };
}

export function resolveToolarsAuthSessionFromRequest(
  request?: Request | null,
  options: ResolveToolarsAuthSessionOptions = {}
): ToolarsAuthSession | null {
  const cookieValue = readCookieValue(request, TOOLARS_SESSION_COOKIE_NAME);
  if (!cookieValue) return null;

  const [encodedPayload, signature] = cookieValue.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signSessionPayload(encodedPayload, getSessionSecret(options.secret));
  if (!isMatchingSignature(signature, expectedSignature)) return null;

  const payload = parseSessionPayload(encodedPayload);
  if (!payload) return null;

  const now = options.now?.() ?? new Date();
  if (Date.parse(payload.expiresAt) <= now.getTime()) return null;

  return {
    accountEmail: payload.accountEmail,
    accountId: payload.accountId,
    expiresAt: payload.expiresAt,
    issuedAt: payload.issuedAt,
    sessionId: payload.sessionId
  };
}

export function createToolarsAccountIdFromEmail(accountEmail: string) {
  const localPart = accountEmail
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
  return `acct_${localPart || "account"}`;
}

function parseSessionPayload(encodedPayload: string): ToolarsAuthSessionPayload | null {
  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as Partial<ToolarsAuthSessionPayload>;
    if (
      payload.version !== 1 ||
      !payload.accountId ||
      !payload.expiresAt ||
      !payload.issuedAt ||
      !payload.sessionId ||
      Number.isNaN(Date.parse(payload.expiresAt)) ||
      Number.isNaN(Date.parse(payload.issuedAt))
    ) {
      return null;
    }

    return {
      accountEmail: normalizeAccountEmail(payload.accountEmail),
      accountId: normalizeAccountId(payload.accountId),
      expiresAt: payload.expiresAt,
      issuedAt: payload.issuedAt,
      sessionId: normalizeSessionId(payload.sessionId),
      version: 1
    };
  } catch {
    return null;
  }
}

function readCookieValue(request: Request | null | undefined, cookieName: string) {
  const cookieHeader = request?.headers.get("cookie");
  if (!cookieHeader) return null;

  for (const cookiePart of cookieHeader.split(";")) {
    const [name, ...rawValueParts] = cookiePart.trim().split("=");
    if (name === cookieName) return rawValueParts.join("=");
  }

  return null;
}

function signSessionPayload(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

function isMatchingSignature(candidate: string, expected: string) {
  if (!candidate || candidate.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
  } catch {
    return false;
  }
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function buildExpiresAt(issuedAt: string, maxAgeSeconds: number) {
  const issuedDate = new Date(issuedAt);
  const expiresDate = Number.isNaN(issuedDate.getTime()) ? new Date() : issuedDate;
  expiresDate.setSeconds(expiresDate.getSeconds() + maxAgeSeconds);
  return expiresDate.toISOString();
}

function normalizeAccountId(accountId: string) {
  return accountId.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 80) || "account-local";
}

function normalizeAccountEmail(accountEmail?: string | null) {
  const normalized = accountEmail?.trim().toLowerCase();
  return normalized || null;
}

function normalizeSessionId(sessionId: string) {
  return sessionId.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 120) || `sess_${randomUUID()}`;
}

function getSessionSecret(explicitSecret?: string) {
  const secret = explicitSecret ?? process.env.TOOLARS_AUTH_SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("TOOLARS_AUTH_SESSION_SECRET is required in production");
  }
  return "toolars-local-auth-session-secret";
}

function shouldUseSecureCookie() {
  return process.env.NODE_ENV === "production";
}
