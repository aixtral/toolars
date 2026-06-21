import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getServerConsentAuditLedgerForAccount, resetServerConsentAuditLedger, setServerConsentAuditLedgerStoragePathForTest } from "@/lib/ai/server-consent-audit-ledger";
import { getToolarsAccountProfile, resetToolarsAccountStore, setToolarsAccountStoreStoragePathForTest } from "@/lib/auth/toolars-account-store";
import { resolveToolarsAuthContext } from "@/lib/auth/toolars-auth-context";
import { resolveToolarsAuthSessionFromRequest } from "@/lib/auth/toolars-auth-session";
import { getToolarsStoredAuthSession, resetToolarsAuthSessionLedger, setToolarsAuthSessionLedgerStoragePathForTest } from "@/lib/auth/toolars-auth-session-ledger";
import { createGoogleOAuthStateCookieForTest } from "@/lib/auth/toolars-google-oauth";
import { GET } from "./route";

describe("/api/auth/google/callback", () => {
  let tempDirectory: string;
  const originalClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const originalClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const originalRedirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
  const originalSessionSecret = process.env.TOOLARS_AUTH_SESSION_SECRET;

  beforeEach(() => {
    tempDirectory = mkdtempSync(join(tmpdir(), "toolars-google-callback-"));
    process.env.GOOGLE_OAUTH_CLIENT_ID = "google-client-id";
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = "google-client-secret";
    process.env.GOOGLE_OAUTH_REDIRECT_URI = "https://toolars.test/api/auth/google/callback";
    process.env.TOOLARS_AUTH_SESSION_SECRET = "test-session-secret";
    setToolarsAccountStoreStoragePathForTest(join(tempDirectory, "accounts.json"));
    setServerConsentAuditLedgerStoragePathForTest(join(tempDirectory, "ledger.json"));
    setToolarsAuthSessionLedgerStoragePathForTest(join(tempDirectory, "sessions.json"));
    resetToolarsAccountStore();
    resetServerConsentAuditLedger();
    resetToolarsAuthSessionLedger();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-21T11:05:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    process.env.GOOGLE_OAUTH_CLIENT_ID = originalClientId;
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = originalClientSecret;
    process.env.GOOGLE_OAUTH_REDIRECT_URI = originalRedirectUri;
    process.env.TOOLARS_AUTH_SESSION_SECRET = originalSessionSecret;
    setToolarsAccountStoreStoragePathForTest(null);
    setServerConsentAuditLedgerStoragePathForTest(null);
    setToolarsAuthSessionLedgerStoragePathForTest(null);
    rmSync(tempDirectory, { force: true, recursive: true });
  });

  it("exchanges the Google code, verifies userinfo, and issues the Toolars session cookie", async () => {
    const stateCookie = createGoogleOAuthStateCookieForTest({
      state: "google_oauth_state_001",
      workspaceId: "toolars_ws_google_trial"
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          access_token: "google-access-token",
          expires_in: 3600,
          token_type: "Bearer"
        }),
        ok: true
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          email: "Owner@Example.com",
          email_verified: true,
          name: "Owner Example",
          sub: "google-user-123"
        }),
        ok: true
      });
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(
      new Request("https://toolars.test/api/auth/google/callback?code=oauth-code&state=google_oauth_state_001", {
        headers: {
          cookie: stateCookie
        }
      })
    );
    const setCookie = response.headers.get("set-cookie") ?? "";
    const account = getToolarsAccountProfile("acct_google_google-user-123");
    const accountLedger = getServerConsentAuditLedgerForAccount("acct_google_google-user-123");

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("/my-tools");
    expect(setCookie).toContain("toolars_session=");
    expect(setCookie).toContain("toolars_google_oauth_state=;");
    expect(account).toMatchObject({
      accountEmail: "owner@example.com",
      accountId: "acct_google_google-user-123"
    });
    expect(accountLedger.accountBindings).toHaveLength(1);
    expect(accountLedger.accountBindings[0]).toMatchObject({
      accountEmail: "owner@example.com",
      accountId: "acct_google_google-user-123",
      workspaceId: "toolars_ws_google_trial"
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://oauth2.googleapis.com/token",
      expect.objectContaining({
        body: expect.any(URLSearchParams),
        method: "POST"
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://openidconnect.googleapis.com/v1/userinfo",
      expect.objectContaining({
        headers: {
          Authorization: "Bearer google-access-token"
        }
      })
    );
    const auth = resolveToolarsAuthContext(
      new Request("https://toolars.test/settings", {
        headers: {
          cookie: setCookie,
          "x-toolars-workspace-id": "toolars_ws_google_trial"
        }
      }),
      {
        now: () => new Date("2026-06-21T11:06:00Z"),
        sessionSecret: "test-session-secret"
      }
    );
    expect(auth).toMatchObject({
      accountEmail: "owner@example.com",
      accountId: "acct_google_google-user-123",
      isAuthenticated: true,
      source: "session"
    });
    const session = resolveToolarsAuthSessionFromRequest(
      new Request("https://toolars.test/settings", {
        headers: {
          cookie: setCookie
        }
      }),
      {
        now: () => new Date("2026-06-21T11:06:00Z"),
        secret: "test-session-secret"
      }
    );
    expect(session?.sessionId).toMatch(/^sess_/);
    expect(getToolarsStoredAuthSession(session?.sessionId ?? "")).toMatchObject({
      accountId: "acct_google_google-user-123",
      status: "active"
    });
  });

  it("rejects callbacks without a matching OAuth state cookie", async () => {
    const response = await GET(
      new Request("https://toolars.test/api/auth/google/callback?code=oauth-code&state=wrong-state", {
        headers: {
          cookie: createGoogleOAuthStateCookieForTest({
            state: "google_oauth_state_001",
            workspaceId: "toolars_ws_google_trial"
          })
        }
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("Invalid Google OAuth state");
  });
});
