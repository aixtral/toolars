import { describe, expect, it } from "vitest";
import { createToolarsAuthSessionCookie, resolveToolarsAuthSessionFromRequest } from "./toolars-auth-session";

const SESSION_SECRET = "test-session-secret";

describe("toolars auth session cookies", () => {
  it("resolves a signed HttpOnly session cookie into account identity", () => {
    const { cookie, session } = createToolarsAuthSessionCookie({
      accountEmail: "owner@example.com",
      accountId: "acct_owner_example_com",
      expiresAt: "2026-06-21T10:30:00Z",
      issuedAt: "2026-06-21T09:30:00Z",
      secret: SESSION_SECRET,
      sessionId: "sess_123"
    });

    const resolved = resolveToolarsAuthSessionFromRequest(
      new Request("http://toolars.test/api/billing/account", {
        headers: {
          cookie
        }
      }),
      {
        now: () => new Date("2026-06-21T09:45:00Z"),
        secret: SESSION_SECRET
      }
    );

    expect(cookie).toContain("toolars_session=");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(resolved).toEqual(session);
  });

  it("rejects tampered session cookies", () => {
    const { cookie } = createToolarsAuthSessionCookie({
      accountEmail: "owner@example.com",
      accountId: "acct_owner_example_com",
      expiresAt: "2026-06-21T10:30:00Z",
      issuedAt: "2026-06-21T09:30:00Z",
      secret: SESSION_SECRET,
      sessionId: "sess_123"
    });

    const tamperedCookie = cookie.replace(/toolars_session=([^;.]+)/, (_match, value: string) => {
      const replacement = value.endsWith("A") ? "B" : "A";
      return `toolars_session=${value.slice(0, -1)}${replacement}`;
    });
    const resolved = resolveToolarsAuthSessionFromRequest(
      new Request("http://toolars.test/api/billing/account", {
        headers: {
          cookie: tamperedCookie
        }
      }),
      {
        now: () => new Date("2026-06-21T09:45:00Z"),
        secret: SESSION_SECRET
      }
    );

    expect(resolved).toBeNull();
  });

  it("rejects expired session cookies", () => {
    const { cookie } = createToolarsAuthSessionCookie({
      accountEmail: "owner@example.com",
      accountId: "acct_owner_example_com",
      expiresAt: "2026-06-21T09:35:00Z",
      issuedAt: "2026-06-21T09:30:00Z",
      secret: SESSION_SECRET,
      sessionId: "sess_123"
    });

    const resolved = resolveToolarsAuthSessionFromRequest(
      new Request("http://toolars.test/api/billing/account", {
        headers: {
          cookie
        }
      }),
      {
        now: () => new Date("2026-06-21T09:45:00Z"),
        secret: SESSION_SECRET
      }
    );

    expect(resolved).toBeNull();
  });
});
