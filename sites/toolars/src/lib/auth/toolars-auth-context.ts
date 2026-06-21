import { resolvePersistedToolarsAuthSessionFromRequest } from "./toolars-auth-session-ledger";

export const DEFAULT_TOOLARS_WORKSPACE_ID = "anonymous-local";

export interface ToolarsAuthContext {
  accountEmail: string | null;
  accountId: string | null;
  isAuthenticated: boolean;
  source: "anonymous" | "preview-header" | "session";
  workspaceId: string;
}

export interface ToolarsAuthContextOptions {
  allowPreviewHeaders?: boolean;
  environment?: string;
  now?: () => Date;
  sessionPreviousSecrets?: string[];
  sessionSecret?: string;
}

export function resolveToolarsAuthContext(
  request?: Request | null,
  options: ToolarsAuthContextOptions = {}
): ToolarsAuthContext {
  const workspaceId = normalizeWorkspaceId(request?.headers.get("x-toolars-workspace-id"));
  const session = resolvePersistedToolarsAuthSessionFromRequest(request, {
    now: options.now,
    previousSecrets: options.sessionPreviousSecrets,
    secret: options.sessionSecret
  });

  if (session) {
    return {
      accountEmail: session.accountEmail,
      accountId: session.accountId,
      isAuthenticated: true,
      source: "session",
      workspaceId
    };
  }

  const allowPreviewHeaders = options.allowPreviewHeaders ?? shouldAllowPreviewHeaders(options.environment);

  if (!allowPreviewHeaders) {
    return {
      accountEmail: null,
      accountId: null,
      isAuthenticated: false,
      source: "anonymous",
      workspaceId
    };
  }

  const accountId = normalizeAccountId(request?.headers.get("x-toolars-account-id"));
  if (!accountId) {
    return {
      accountEmail: null,
      accountId: null,
      isAuthenticated: false,
      source: "anonymous",
      workspaceId
    };
  }

  const accountEmail = normalizeAccountEmail(request?.headers.get("x-toolars-account-email"));
  return {
    accountEmail,
    accountId,
    isAuthenticated: true,
    source: "preview-header",
    workspaceId
  };
}

function shouldAllowPreviewHeaders(environment: string | undefined = getRuntimeEnvironment()) {
  if (getPreviewHeaderFlag() === "enabled") return true;
  return environment !== "production";
}

function normalizeWorkspaceId(workspaceId?: string | null) {
  const normalized = workspaceId?.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 80);
  return normalized || DEFAULT_TOOLARS_WORKSPACE_ID;
}

function normalizeAccountId(accountId?: string | null) {
  const normalized = accountId?.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 80);
  return normalized || null;
}

function normalizeAccountEmail(accountEmail?: string | null) {
  const normalized = accountEmail?.trim();
  return normalized || null;
}

function getRuntimeEnvironment(): string {
  if (typeof process === "undefined") return "production";
  return process.env.NODE_ENV ?? "production";
}

function getPreviewHeaderFlag() {
  if (typeof process === "undefined") return undefined;
  return process.env.TOOLARS_AUTH_PREVIEW_HEADERS;
}
