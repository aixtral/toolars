import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const TOOLARS_GOOGLE_OAUTH_STATE_COOKIE_NAME = "toolars_google_oauth_state";
export const GOOGLE_OAUTH_AUTHORIZATION_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_OAUTH_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
export const GOOGLE_OPENID_USERINFO_ENDPOINT = "https://openidconnect.googleapis.com/v1/userinfo";
export const GOOGLE_OAUTH_SCOPE = "openid email profile";

interface GoogleOAuthStatePayload {
  issuedAt: string;
  state: string;
  version: 1;
  workspaceId: string;
}

export interface CreateGoogleOAuthStateCookieOptions {
  issuedAt?: string;
  maxAgeSeconds?: number;
  secure?: boolean;
  state?: string;
  workspaceId: string;
}

export function createGoogleOAuthStateCookie(options: CreateGoogleOAuthStateCookieOptions) {
  const state = normalizeState(options.state ?? `google_oauth_${randomUUID()}`);
  return {
    cookie: serializeGoogleOAuthStateCookie({
      issuedAt: options.issuedAt,
      maxAgeSeconds: options.maxAgeSeconds,
      secure: options.secure,
      state,
      workspaceId: options.workspaceId
    }),
    state
  };
}

export function createGoogleOAuthStateCookieForTest(options: CreateGoogleOAuthStateCookieOptions) {
  return createGoogleOAuthStateCookie(options).cookie;
}

export function resolveGoogleOAuthStateFromRequest(request: Request, expectedState: string) {
  const cookie = readCookieValue(request, TOOLARS_GOOGLE_OAUTH_STATE_COOKIE_NAME);
  if (!cookie) return null;

  const [encodedPayload, signature] = cookie.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload);
  if (!isMatchingSignature(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as Partial<GoogleOAuthStatePayload>;
    if (payload.version !== 1 || payload.state !== expectedState || !payload.workspaceId) return null;
    return {
      issuedAt: payload.issuedAt ?? new Date().toISOString(),
      state: payload.state,
      workspaceId: normalizeWorkspaceId(payload.workspaceId)
    };
  } catch {
    return null;
  }
}

export function clearGoogleOAuthStateCookie() {
  return `${TOOLARS_GOOGLE_OAUTH_STATE_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

export function createGoogleAccountId(googleSubject: string) {
  const subject = googleSubject.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 64);
  return `acct_google_${subject || "user"}`;
}

function serializeGoogleOAuthStateCookie({
  issuedAt = new Date().toISOString(),
  maxAgeSeconds = 600,
  secure,
  state,
  workspaceId
}: CreateGoogleOAuthStateCookieOptions & { state: string }) {
  const payload: GoogleOAuthStatePayload = {
    issuedAt,
    state: normalizeState(state),
    version: 1,
    workspaceId: normalizeWorkspaceId(workspaceId)
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = signPayload(encodedPayload);
  const cookieParts = [
    `${TOOLARS_GOOGLE_OAUTH_STATE_COOKIE_NAME}=${encodedPayload}.${signature}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`
  ];

  if (secure ?? shouldUseSecureCookie()) {
    cookieParts.push("Secure");
  }

  return cookieParts.join("; ");
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getSessionSecret()).update(encodedPayload).digest("base64url");
}

function isMatchingSignature(candidate: string, expected: string) {
  if (!candidate || candidate.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
  } catch {
    return false;
  }
}

function readCookieValue(request: Request, cookieName: string) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  for (const cookiePart of cookieHeader.split(";")) {
    const [name, ...rawValueParts] = cookiePart.trim().split("=");
    if (name === cookieName) return rawValueParts.join("=");
  }

  return null;
}

function normalizeState(state: string) {
  return state.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 120) || `google_oauth_${randomUUID()}`;
}

function normalizeWorkspaceId(workspaceId: string) {
  return workspaceId.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 80) || "anonymous-local";
}

function getSessionSecret() {
  const secret = process.env.TOOLARS_AUTH_SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("TOOLARS_AUTH_SESSION_SECRET is required in production");
  }
  return "toolars-local-auth-session-secret";
}

function shouldUseSecureCookie() {
  return process.env.NODE_ENV === "production";
}
