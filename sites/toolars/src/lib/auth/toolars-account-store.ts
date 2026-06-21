import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { getToolarsRuntimeFilePath, TOOLARS_RUNTIME_FILES } from "@/lib/ops/toolars-runtime-config";

export interface ToolarsAccountProfile {
  accountEmail: string;
  accountId: string;
  createdAt: string;
  lastSignedInAt: string;
  source: "session";
  updatedAt: string;
  version: 1;
}

interface ToolarsAccountStore {
  accounts: Record<string, ToolarsAccountProfile>;
  version: 1;
}

export interface ToolarsAccountStorePersistenceDriver {
  read: () => ToolarsAccountStore | null;
  write: (store: ToolarsAccountStore) => void;
}

let storagePathForTest: string | null = null;
let persistenceDriverForTest: ToolarsAccountStorePersistenceDriver | null = null;

export function upsertToolarsAccountProfile({
  accountEmail,
  accountId,
  signedInAt = new Date().toISOString()
}: {
  accountEmail: string;
  accountId: string;
  signedInAt?: string;
}) {
  const normalizedAccountId = normalizeAccountId(accountId);
  const normalizedAccountEmail = normalizeAccountEmail(accountEmail);
  const store = readAccountStore();
  const currentAccount = store.accounts[normalizedAccountId];
  const account: ToolarsAccountProfile = {
    accountEmail: normalizedAccountEmail,
    accountId: normalizedAccountId,
    createdAt: currentAccount?.createdAt ?? signedInAt,
    lastSignedInAt: signedInAt,
    source: "session",
    updatedAt: signedInAt,
    version: 1
  };

  store.accounts[normalizedAccountId] = account;
  writeAccountStore(store);
  return { ...account };
}

export function getToolarsAccountProfile(accountId: string) {
  const account = readAccountStore().accounts[normalizeAccountId(accountId)];
  return account ? { ...account } : null;
}

export function resetToolarsAccountStore() {
  writeAccountStore(createEmptyAccountStore());
}

export function setToolarsAccountStoreStoragePathForTest(path: string | null) {
  storagePathForTest = path;
}

export function setToolarsAccountStorePersistenceDriverForTest(driver: ToolarsAccountStorePersistenceDriver | null) {
  persistenceDriverForTest = driver;
}

function readAccountStore(): ToolarsAccountStore {
  const persistenceDriver = getAccountStorePersistenceDriver();
  if (persistenceDriver) return coerceAccountStore(persistenceDriver.read());

  const storagePath = getAccountStoreStoragePath();
  if (!existsSync(/*turbopackIgnore: true*/ storagePath)) return createEmptyAccountStore();

  try {
    return coerceAccountStore(JSON.parse(readFileSync(/*turbopackIgnore: true*/ storagePath, "utf8")));
  } catch {
    return createEmptyAccountStore();
  }
}

function writeAccountStore(store: ToolarsAccountStore) {
  const persistenceDriver = getAccountStorePersistenceDriver();
  if (persistenceDriver) {
    persistenceDriver.write(cloneAccountStore(store));
    return;
  }

  const storagePath = getAccountStoreStoragePath();
  mkdirSync(/*turbopackIgnore: true*/ dirname(storagePath), { recursive: true });
  writeFileSync(/*turbopackIgnore: true*/ storagePath, `${JSON.stringify(store, null, 2)}\n`);
}

function coerceAccountStore(store: unknown): ToolarsAccountStore {
  if (!store || typeof store !== "object") return createEmptyAccountStore();

  const candidate = store as Partial<ToolarsAccountStore>;
  if (candidate.version !== 1 || !candidate.accounts || typeof candidate.accounts !== "object") {
    return createEmptyAccountStore();
  }

  return {
    accounts: Object.entries(candidate.accounts).reduce<Record<string, ToolarsAccountProfile>>(
      (accounts, [accountId, account]) => {
        const coerced = coerceAccountProfile(account, accountId);
        if (coerced) accounts[coerced.accountId] = coerced;
        return accounts;
      },
      {}
    ),
    version: 1
  };
}

function coerceAccountProfile(account: unknown, fallbackAccountId: string): ToolarsAccountProfile | null {
  if (!account || typeof account !== "object") return null;

  const candidate = account as Partial<ToolarsAccountProfile>;
  if (!candidate.accountEmail || !candidate.createdAt || !candidate.lastSignedInAt || !candidate.updatedAt) return null;

  return {
    accountEmail: normalizeAccountEmail(candidate.accountEmail),
    accountId: normalizeAccountId(candidate.accountId ?? fallbackAccountId),
    createdAt: candidate.createdAt,
    lastSignedInAt: candidate.lastSignedInAt,
    source: "session",
    updatedAt: candidate.updatedAt,
    version: 1
  };
}

function cloneAccountStore(store: ToolarsAccountStore): ToolarsAccountStore {
  return {
    accounts: Object.fromEntries(Object.entries(store.accounts).map(([accountId, account]) => [accountId, { ...account }])),
    version: 1
  };
}

function createEmptyAccountStore(): ToolarsAccountStore {
  return {
    accounts: {},
    version: 1
  };
}

function getAccountStorePersistenceDriver() {
  return persistenceDriverForTest;
}

function getAccountStoreStoragePath() {
  return (
    storagePathForTest ??
    getToolarsRuntimeFilePath({
      envKey: "TOOLARS_ACCOUNT_STORE_PATH",
      fallbackPath: join(".next", "cache", TOOLARS_RUNTIME_FILES.accountStore),
      fileName: TOOLARS_RUNTIME_FILES.accountStore
    })
  );
}

function normalizeAccountId(accountId: string) {
  return accountId.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 80) || "account-local";
}

function normalizeAccountEmail(accountEmail: string) {
  return accountEmail.trim().toLowerCase() || "owner@example.com";
}
