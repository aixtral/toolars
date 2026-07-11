import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getToolarsAccountProfile,
  resetToolarsAccountStore,
  setToolarsAccountStoreStoragePathForTest,
  upsertToolarsAccountProfile
} from "./toolars-account-store";

describe("toolars account store", () => {
  let tempDirectory: string;

  beforeEach(() => {
    tempDirectory = mkdtempSync(join(tmpdir(), "toolars-account-store-"));
    setToolarsAccountStoreStoragePathForTest(join(tempDirectory, "accounts.json"));
    resetToolarsAccountStore();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    setToolarsAccountStoreStoragePathForTest(null);
    rmSync(tempDirectory, { force: true, recursive: true });
  });

  it("creates and persists a normalized server account profile", () => {
    const account = upsertToolarsAccountProfile({
      accountEmail: " Owner@Example.com ",
      accountId: "acct owner",
      signedInAt: "2026-06-21T10:40:00Z"
    });

    expect(account).toEqual({
      accountEmail: "owner@example.com",
      accountId: "acct-owner",
      createdAt: "2026-06-21T10:40:00Z",
      lastSignedInAt: "2026-06-21T10:40:00Z",
      source: "session",
      updatedAt: "2026-06-21T10:40:00Z",
      version: 1
    });
    expect(getToolarsAccountProfile("acct owner")).toEqual(account);
  });

  it("updates an existing account while preserving its creation timestamp", () => {
    upsertToolarsAccountProfile({
      accountEmail: "owner@example.com",
      accountId: "acct-owner",
      signedInAt: "2026-06-21T10:40:00Z"
    });

    const account = upsertToolarsAccountProfile({
      accountEmail: "owner+new@example.com",
      accountId: "acct-owner",
      signedInAt: "2026-06-21T10:55:00Z"
    });

    expect(account).toMatchObject({
      accountEmail: "owner+new@example.com",
      accountId: "acct-owner",
      createdAt: "2026-06-21T10:40:00Z",
      lastSignedInAt: "2026-06-21T10:55:00Z",
      updatedAt: "2026-06-21T10:55:00Z"
    });
  });

  it("uses TOOLARS_ACCOUNT_STORE_PATH for production runtime persistence", () => {
    const originalAccountStorePath = process.env.TOOLARS_ACCOUNT_STORE_PATH;
    const runtimePath = join(tempDirectory, "runtime", "accounts.json");
    setToolarsAccountStoreStoragePathForTest(null);
    process.env.TOOLARS_ACCOUNT_STORE_PATH = runtimePath;

    try {
      resetToolarsAccountStore();
      upsertToolarsAccountProfile({
        accountEmail: "runtime@example.com",
        accountId: "acct-runtime",
        signedInAt: "2026-06-21T12:00:00Z"
      });

      expect(existsSync(runtimePath)).toBe(true);
      expect(JSON.parse(readFileSync(runtimePath, "utf8"))).toMatchObject({
        accounts: {
          "acct-runtime": {
            accountEmail: "runtime@example.com",
            accountId: "acct-runtime"
          }
        },
        version: 1
      });
    } finally {
      process.env.TOOLARS_ACCOUNT_STORE_PATH = originalAccountStorePath;
    }
  });

  it("rejects production writes to the legacy local account store", () => {
    const originalAccountStorePath = process.env.TOOLARS_ACCOUNT_STORE_PATH;
    setToolarsAccountStoreStoragePathForTest(null);
    vi.stubEnv("NODE_ENV", "production");
    process.env.TOOLARS_ACCOUNT_STORE_PATH = join(tempDirectory, "runtime", "accounts.json");

    try {
      expect(() =>
        upsertToolarsAccountProfile({
          accountEmail: "runtime@example.com",
          accountId: "acct-runtime",
          signedInAt: "2026-06-21T12:00:00Z"
        })
      ).toThrow(/Supabase profiles/);
    } finally {
      process.env.TOOLARS_ACCOUNT_STORE_PATH = originalAccountStorePath;
    }
  });
});
