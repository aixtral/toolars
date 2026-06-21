import { describe, expect, it } from "vitest";
import { resolveToolarsAuthContext } from "./toolars-auth-context";
import { createToolarsAuthSessionCookie } from "./toolars-auth-session";
import { persistToolarsAuthSession, resetToolarsAuthSessionLedger } from "./toolars-auth-session-ledger";

describe("resolveToolarsAuthContext", () => {
  it("keeps anonymous workspace scope when no account identity is available", () => {
    const context = resolveToolarsAuthContext(
      new Request("http://toolars.test/api/ai/consent-audit", {
        headers: {
          "x-toolars-workspace-id": "workspace alpha"
        }
      }),
      { environment: "production" }
    );

    expect(context).toEqual({
      accountEmail: null,
      accountId: null,
      isAuthenticated: false,
      source: "anonymous",
      workspaceId: "workspace-alpha"
    });
  });

  it("ignores preview account headers in production unless explicitly enabled", () => {
    const context = resolveToolarsAuthContext(
      new Request("http://toolars.test/api/ai/consent-audit", {
        headers: {
          "x-toolars-account-email": "owner@example.com",
          "x-toolars-account-id": "acct-preview-123",
          "x-toolars-workspace-id": "anon-workspace"
        }
      }),
      { environment: "production" }
    );

    expect(context).toMatchObject({
      accountEmail: null,
      accountId: null,
      isAuthenticated: false,
      source: "anonymous",
      workspaceId: "anon-workspace"
    });
  });

  it("accepts sanitized preview account headers when the preview gate is enabled", () => {
    const context = resolveToolarsAuthContext(
      new Request("http://toolars.test/api/ai/consent-audit", {
        headers: {
          "x-toolars-account-email": " owner@example.com ",
          "x-toolars-account-id": "acct preview 123",
          "x-toolars-workspace-id": "anon-workspace"
        }
      }),
      { allowPreviewHeaders: true, environment: "production" }
    );

    expect(context).toEqual({
      accountEmail: "owner@example.com",
      accountId: "acct-preview-123",
      isAuthenticated: true,
      source: "preview-header",
      workspaceId: "anon-workspace"
    });
  });

  it("authenticates production requests from a signed session cookie before preview headers", () => {
    resetToolarsAuthSessionLedger();
    const { cookie, session } = createToolarsAuthSessionCookie({
      accountEmail: "owner@example.com",
      accountId: "acct_session_owner",
      expiresAt: "2026-06-21T10:30:00Z",
      issuedAt: "2026-06-21T09:30:00Z",
      secret: "test-session-secret",
      sessionId: "sess_context"
    });
    persistToolarsAuthSession(session);

    const context = resolveToolarsAuthContext(
      new Request("http://toolars.test/api/billing/account", {
        headers: {
          cookie,
          "x-toolars-account-email": "preview@example.com",
          "x-toolars-account-id": "acct-preview-123",
          "x-toolars-workspace-id": "workspace alpha"
        }
      }),
      {
        environment: "production",
        now: () => new Date("2026-06-21T09:45:00Z"),
        sessionSecret: "test-session-secret"
      }
    );

    expect(context).toEqual({
      accountEmail: "owner@example.com",
      accountId: "acct_session_owner",
      isAuthenticated: true,
      source: "session",
      workspaceId: "workspace-alpha"
    });
  });

  it("rejects signed session cookies that are not present in the server session ledger", () => {
    resetToolarsAuthSessionLedger();
    const { cookie } = createToolarsAuthSessionCookie({
      accountEmail: "owner@example.com",
      accountId: "acct_session_owner",
      expiresAt: "2026-06-21T10:30:00Z",
      issuedAt: "2026-06-21T09:30:00Z",
      secret: "test-session-secret",
      sessionId: "sess_missing"
    });

    const context = resolveToolarsAuthContext(
      new Request("http://toolars.test/api/billing/account", {
        headers: {
          cookie,
          "x-toolars-workspace-id": "workspace alpha"
        }
      }),
      {
        environment: "production",
        now: () => new Date("2026-06-21T09:45:00Z"),
        sessionSecret: "test-session-secret"
      }
    );

    expect(context).toEqual({
      accountEmail: null,
      accountId: null,
      isAuthenticated: false,
      source: "anonymous",
      workspaceId: "workspace-alpha"
    });
  });
});
