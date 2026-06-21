import { bindServerConsentAuditWorkspaceToAccount } from "@/lib/ai/server-consent-audit-ledger";
import {
  createToolarsAuthSessionCookie,
  type ToolarsAuthSession
} from "@/lib/auth/toolars-auth-session";
import { upsertToolarsAccountProfile } from "@/lib/auth/toolars-account-store";
import { persistToolarsAuthSession } from "@/lib/auth/toolars-auth-session-ledger";

export interface IssueToolarsSessionOptions {
  accountEmail: string;
  accountId: string;
  boundAt?: string;
  workspaceId: string;
}

export function issueToolarsSession({ accountEmail, accountId, boundAt, workspaceId }: IssueToolarsSessionOptions) {
  const normalizedAccountEmail = normalizeAccountEmail(accountEmail);
  const normalizedAccountId = normalizeAccountId(accountId);
  const { cookie, session } = createToolarsAuthSessionCookie({
    accountEmail: normalizedAccountEmail,
    accountId: normalizedAccountId
  });
  persistToolarsAuthSession(session);
  const account = upsertToolarsAccountProfile({
    accountEmail: normalizedAccountEmail,
    accountId: normalizedAccountId,
    signedInAt: session.issuedAt
  });
  const { binding, ledger } = bindServerConsentAuditWorkspaceToAccount({
    accountEmail: normalizedAccountEmail,
    accountId: normalizedAccountId,
    boundAt,
    workspaceId
  });

  return {
    account,
    auth: buildSessionAuth(session, workspaceId),
    binding,
    cookie,
    ledger,
    session
  };
}

export function buildSessionAuth(session: ToolarsAuthSession, workspaceId: string) {
  return {
    accountEmail: session.accountEmail,
    accountId: session.accountId,
    isAuthenticated: true,
    sessionId: session.sessionId,
    source: "session" as const,
    workspaceId
  };
}

function normalizeAccountId(accountId: string) {
  return accountId.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 80) || "account-local";
}

function normalizeAccountEmail(accountEmail: string) {
  return accountEmail.trim().toLowerCase();
}
