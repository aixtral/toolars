import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getServerConsentAuditLedgerForAccount, resetServerConsentAuditLedger, setServerConsentAuditLedgerStoragePathForTest } from "@/lib/ai/server-consent-audit-ledger";
import { resolveToolarsAuthContext } from "@/lib/auth/toolars-auth-context";
import { getToolarsAccountProfile, resetToolarsAccountStore, setToolarsAccountStoreStoragePathForTest } from "@/lib/auth/toolars-account-store";
import { getToolarsStoredAuthSession, resetToolarsAuthSessionLedger, setToolarsAuthSessionLedgerStoragePathForTest } from "@/lib/auth/toolars-auth-session-ledger";
import { DELETE, GET, POST } from "./route";

describe("/api/auth/session", () => {
  let tempDirectory: string;
  const originalSecret = process.env.TOOLARS_AUTH_SESSION_SECRET;

  beforeEach(() => {
    tempDirectory = mkdtempSync(join(tmpdir(), "toolars-api-auth-session-"));
    process.env.TOOLARS_AUTH_SESSION_SECRET = "test-session-secret";
    setToolarsAccountStoreStoragePathForTest(join(tempDirectory, "accounts.json"));
    setServerConsentAuditLedgerStoragePathForTest(join(tempDirectory, "ledger.json"));
    setToolarsAuthSessionLedgerStoragePathForTest(join(tempDirectory, "sessions.json"));
    resetToolarsAccountStore();
    resetServerConsentAuditLedger();
    resetToolarsAuthSessionLedger();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-21T09:30:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    process.env.TOOLARS_AUTH_SESSION_SECRET = originalSecret;
    setToolarsAccountStoreStoragePathForTest(null);
    setServerConsentAuditLedgerStoragePathForTest(null);
    setToolarsAuthSessionLedgerStoragePathForTest(null);
    rmSync(tempDirectory, { force: true, recursive: true });
  });

  it("creates a signed session cookie and binds the workspace ledger to the account", async () => {
    const response = await POST(
      new Request("http://toolars.test/api/auth/session", {
        body: JSON.stringify({
          accountEmail: "Owner@Example.com",
          accountId: "acct_owner_example_com"
        }),
        headers: {
          "Content-Type": "application/json",
          "x-toolars-workspace-id": "toolars_ws_session_test"
        },
        method: "POST"
      })
    );

    const payload = await response.json();
    const setCookie = response.headers.get("set-cookie") ?? "";
    const auth = resolveToolarsAuthContext(
      new Request("http://toolars.test/api/billing/account", {
        headers: {
          cookie: setCookie,
          "x-toolars-workspace-id": "toolars_ws_session_test"
        }
      }),
      {
        now: () => new Date("2026-06-21T09:31:00Z"),
        sessionSecret: "test-session-secret"
      }
    );
    const accountLedger = getServerConsentAuditLedgerForAccount("acct_owner_example_com");

    expect(response.status).toBe(201);
    expect(setCookie).toContain("toolars_session=");
    expect(setCookie).toContain("HttpOnly");
    expect(payload.auth).toMatchObject({
      accountEmail: "owner@example.com",
      accountId: "acct_owner_example_com",
      isAuthenticated: true,
      source: "session"
    });
    expect(auth).toMatchObject({
      accountEmail: "owner@example.com",
      accountId: "acct_owner_example_com",
      isAuthenticated: true,
      source: "session"
    });
    expect(payload.binding).toMatchObject({
      accountEmail: "owner@example.com",
      accountId: "acct_owner_example_com",
      source: "future-login",
      workspaceId: "toolars_ws_session_test"
    });
    expect(accountLedger.accountBindings).toHaveLength(1);
    expect(payload.account).toMatchObject({
      accountEmail: "owner@example.com",
      accountId: "acct_owner_example_com",
      source: "session"
    });
    expect(getToolarsAccountProfile("acct_owner_example_com")).toMatchObject({
      accountEmail: "owner@example.com",
      accountId: "acct_owner_example_com"
    });
    expect(getToolarsStoredAuthSession(payload.auth.sessionId)).toMatchObject({
      accountId: "acct_owner_example_com",
      status: "active"
    });
  });

  it("returns the current server account profile for an active session", async () => {
    const created = await POST(
      new Request("http://toolars.test/api/auth/session", {
        body: JSON.stringify({
          accountEmail: "owner@example.com",
          accountId: "acct_owner_example_com"
        }),
        headers: {
          "Content-Type": "application/json",
          "x-toolars-workspace-id": "toolars_ws_session_test"
        },
        method: "POST"
      })
    );
    const cookie = created.headers.get("set-cookie") ?? "";

    const response = await GET(
      new Request("http://toolars.test/api/auth/session", {
        headers: {
          cookie,
          "x-toolars-workspace-id": "toolars_ws_session_test"
        }
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.auth).toMatchObject({
      accountId: "acct_owner_example_com",
      isAuthenticated: true,
      source: "session"
    });
    expect(payload.account).toMatchObject({
      accountEmail: "owner@example.com",
      accountId: "acct_owner_example_com",
      lastSignedInAt: "2026-06-21T09:30:00.000Z",
      source: "session"
    });
    expect(payload.session).toMatchObject({
      accountId: "acct_owner_example_com",
      status: "active"
    });
  });

  it("revokes the current server session and clears the session cookie", async () => {
    const created = await POST(
      new Request("http://toolars.test/api/auth/session", {
        body: JSON.stringify({
          accountEmail: "owner@example.com",
          accountId: "acct_owner_example_com"
        }),
        headers: {
          "Content-Type": "application/json",
          "x-toolars-workspace-id": "toolars_ws_session_test"
        },
        method: "POST"
      })
    );
    const createdPayload = await created.json();
    const cookie = created.headers.get("set-cookie") ?? "";

    const response = await DELETE(
      new Request("http://toolars.test/api/auth/session", {
        headers: {
          cookie,
          "x-toolars-workspace-id": "toolars_ws_session_test"
        },
        method: "DELETE"
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("toolars_session=;");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
    expect(payload.revokedSession).toMatchObject({
      accountId: "acct_owner_example_com",
      sessionId: createdPayload.auth.sessionId,
      status: "revoked"
    });
    expect(
      resolveToolarsAuthContext(
        new Request("http://toolars.test/api/billing/account", {
          headers: {
            cookie,
            "x-toolars-workspace-id": "toolars_ws_session_test"
          }
        }),
        {
          now: () => new Date("2026-06-21T09:35:00Z"),
          sessionSecret: "test-session-secret"
        }
      )
    ).toMatchObject({
      isAuthenticated: false,
      source: "anonymous"
    });
  });
});
