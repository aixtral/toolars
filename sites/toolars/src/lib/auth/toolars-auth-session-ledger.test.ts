import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createToolarsAuthSessionCookie } from "./toolars-auth-session";
import {
  getToolarsStoredAuthSession,
  persistToolarsAuthSession,
  resetToolarsAuthSessionLedger,
  resolvePersistedToolarsAuthSessionFromRequest,
  revokeToolarsAuthSession,
  setToolarsAuthSessionLedgerStoragePathForTest
} from "./toolars-auth-session-ledger";

describe("toolars auth session ledger", () => {
  let tempDirectory: string;

  beforeEach(() => {
    tempDirectory = mkdtempSync(join(tmpdir(), "toolars-auth-session-ledger-"));
    setToolarsAuthSessionLedgerStoragePathForTest(join(tempDirectory, "sessions.json"));
    resetToolarsAuthSessionLedger();
  });

  afterEach(() => {
    setToolarsAuthSessionLedgerStoragePathForTest(null);
    rmSync(tempDirectory, { force: true, recursive: true });
  });

  it("persists signed sessions and resolves only active server-side sessions", () => {
    const { cookie, session } = createToolarsAuthSessionCookie({
      accountEmail: "owner@example.com",
      accountId: "acct_owner",
      expiresAt: "2026-06-21T10:30:00Z",
      issuedAt: "2026-06-21T09:30:00Z",
      secret: "test-session-secret",
      sessionId: "sess_active"
    });

    expect(
      resolvePersistedToolarsAuthSessionFromRequest(
        new Request("http://toolars.test/settings/billing", {
          headers: { cookie }
        }),
        {
          now: () => new Date("2026-06-21T09:35:00Z"),
          secret: "test-session-secret"
        }
      )
    ).toBeNull();

    persistToolarsAuthSession(session, {
      createdAt: "2026-06-21T09:30:00Z"
    });

    const resolved = resolvePersistedToolarsAuthSessionFromRequest(
      new Request("http://toolars.test/settings/billing", {
        headers: { cookie }
      }),
      {
        now: () => new Date("2026-06-21T09:35:00Z"),
        secret: "test-session-secret"
      }
    );

    expect(resolved).toEqual(session);
    expect(getToolarsStoredAuthSession("sess_active")).toMatchObject({
      accountEmail: "owner@example.com",
      accountId: "acct_owner",
      lastSeenAt: expect.any(String),
      sessionId: "sess_active",
      status: "active"
    });
  });

  it("rejects revoked persisted sessions even when the cookie signature is valid", () => {
    const { cookie, session } = createToolarsAuthSessionCookie({
      accountEmail: "owner@example.com",
      accountId: "acct_owner",
      expiresAt: "2026-06-21T10:30:00Z",
      issuedAt: "2026-06-21T09:30:00Z",
      secret: "test-session-secret",
      sessionId: "sess_revoked"
    });
    persistToolarsAuthSession(session, {
      createdAt: "2026-06-21T09:30:00Z"
    });

    const revoked = revokeToolarsAuthSession("sess_revoked", {
      revokedAt: "2026-06-21T09:40:00Z"
    });

    const resolved = resolvePersistedToolarsAuthSessionFromRequest(
      new Request("http://toolars.test/settings/billing", {
        headers: { cookie }
      }),
      {
        now: () => new Date("2026-06-21T09:45:00Z"),
        secret: "test-session-secret"
      }
    );

    expect(revoked).toMatchObject({
      revokedAt: "2026-06-21T09:40:00Z",
      status: "revoked"
    });
    expect(resolved).toBeNull();
  });

  it("uses TOOLARS_AUTH_SESSION_LEDGER_PATH for production runtime persistence", () => {
    const originalSessionLedgerPath = process.env.TOOLARS_AUTH_SESSION_LEDGER_PATH;
    const runtimePath = join(tempDirectory, "runtime", "sessions.json");
    setToolarsAuthSessionLedgerStoragePathForTest(null);
    process.env.TOOLARS_AUTH_SESSION_LEDGER_PATH = runtimePath;

    try {
      resetToolarsAuthSessionLedger();
      const { session } = createToolarsAuthSessionCookie({
        accountEmail: "runtime@example.com",
        accountId: "acct_runtime",
        expiresAt: "2026-06-21T13:00:00Z",
        issuedAt: "2026-06-21T12:00:00Z",
        secret: "test-session-secret",
        sessionId: "sess_runtime"
      });
      persistToolarsAuthSession(session, {
        createdAt: "2026-06-21T12:00:00Z"
      });

      expect(existsSync(runtimePath)).toBe(true);
      expect(JSON.parse(readFileSync(runtimePath, "utf8"))).toMatchObject({
        sessions: {
          sess_runtime: {
            accountId: "acct_runtime",
            sessionId: "sess_runtime",
            status: "active"
          }
        },
        version: 1
      });
    } finally {
      process.env.TOOLARS_AUTH_SESSION_LEDGER_PATH = originalSessionLedgerPath;
    }
  });
});
