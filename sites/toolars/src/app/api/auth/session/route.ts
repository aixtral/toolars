import { createToolarsAccountIdFromEmail, TOOLARS_SESSION_COOKIE_NAME } from "@/lib/auth/toolars-auth-session";
import { DEFAULT_TOOLARS_WORKSPACE_ID } from "@/lib/auth/toolars-auth-context";
import {
  getToolarsStoredAuthSession,
  resolvePersistedToolarsAuthSessionFromRequest,
  revokeToolarsAuthSession
} from "@/lib/auth/toolars-auth-session-ledger";
import { getToolarsAccountProfile } from "@/lib/auth/toolars-account-store";
import { buildSessionAuth, issueToolarsSession } from "@/lib/auth/toolars-session-issuer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { accountEmail?: string; accountId?: string; boundAt?: string };
    const accountEmail = normalizeAccountEmail(body.accountEmail);
    if (!accountEmail) {
      return Response.json({ error: "Account email is required" }, { status: 400 });
    }

    const accountId = normalizeAccountId(body.accountId ?? createToolarsAccountIdFromEmail(accountEmail));
    const workspaceId = normalizeWorkspaceId(request.headers.get("x-toolars-workspace-id"));
    const issued = issueToolarsSession({
      accountEmail,
      accountId,
      boundAt: body.boundAt,
      workspaceId
    });

    return Response.json(
      {
        account: issued.account,
        auth: issued.auth,
        binding: issued.binding,
        ledger: issued.ledger
      },
      {
        headers: {
          "Set-Cookie": issued.cookie
        },
        status: 201
      }
    );
  } catch {
    return Response.json({ error: "Invalid auth session request" }, { status: 400 });
  }
}

export function GET(request: Request) {
  const session = resolvePersistedToolarsAuthSessionFromRequest(request);
  if (!session) {
    return Response.json({
      account: null,
      auth: {
        accountEmail: null,
        accountId: null,
        isAuthenticated: false,
        source: "anonymous",
        workspaceId: normalizeWorkspaceId(request.headers.get("x-toolars-workspace-id"))
      },
      session: null
    });
  }

  return Response.json({
    account: getToolarsAccountProfile(session.accountId),
    auth: buildSessionAuth(session, normalizeWorkspaceId(request.headers.get("x-toolars-workspace-id"))),
    session: getToolarsStoredAuthSession(session.sessionId)
  });
}

export function DELETE(request: Request) {
  const session = resolvePersistedToolarsAuthSessionFromRequest(request);
  const revokedSession = session ? revokeToolarsAuthSession(session.sessionId) : null;

  return Response.json(
    {
      revokedSession
    },
    {
      headers: {
        "Set-Cookie": clearSessionCookie()
      }
    }
  );
}

function clearSessionCookie() {
  return `${TOOLARS_SESSION_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

function normalizeWorkspaceId(workspaceId?: string | null) {
  const normalized = workspaceId?.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 80);
  return normalized || DEFAULT_TOOLARS_WORKSPACE_ID;
}

function normalizeAccountId(accountId: string) {
  return accountId.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 80) || "account-local";
}

function normalizeAccountEmail(accountEmail?: string | null) {
  const normalized = accountEmail?.trim().toLowerCase();
  return normalized || null;
}
