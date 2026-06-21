import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { getToolarsRuntimeFilePath, TOOLARS_RUNTIME_FILES } from "@/lib/ops/toolars-runtime-config";
import { resolveToolarsAuthSessionFromRequest, type ResolveToolarsAuthSessionOptions, type ToolarsAuthSession } from "./toolars-auth-session";

export interface ToolarsStoredAuthSession extends ToolarsAuthSession {
  createdAt: string;
  lastSeenAt?: string;
  revokedAt?: string;
  status: "active" | "revoked";
  version: 1;
}

interface ToolarsAuthSessionLedgerStore {
  sessions: Record<string, ToolarsStoredAuthSession>;
  version: 1;
}

export interface ToolarsAuthSessionLedgerPersistenceDriver {
  read: () => ToolarsAuthSessionLedgerStore | null;
  write: (store: ToolarsAuthSessionLedgerStore) => void;
}

let storagePathForTest: string | null = null;
let persistenceDriverForTest: ToolarsAuthSessionLedgerPersistenceDriver | null = null;

export function persistToolarsAuthSession(
  session: ToolarsAuthSession,
  options: {
    createdAt?: string;
  } = {}
) {
  const store = readSessionLedgerStore();
  const storedSession: ToolarsStoredAuthSession = {
    ...session,
    createdAt: options.createdAt ?? new Date().toISOString(),
    status: "active",
    version: 1
  };

  store.sessions[session.sessionId] = storedSession;
  writeSessionLedgerStore(store);
  return { ...storedSession };
}

export function getToolarsStoredAuthSession(sessionId: string) {
  const storedSession = readSessionLedgerStore().sessions[normalizeSessionId(sessionId)];
  return storedSession ? { ...storedSession } : null;
}

export function revokeToolarsAuthSession(
  sessionId: string,
  options: {
    revokedAt?: string;
  } = {}
) {
  const normalizedSessionId = normalizeSessionId(sessionId);
  const store = readSessionLedgerStore();
  const storedSession = store.sessions[normalizedSessionId];
  if (!storedSession) return null;

  const revokedSession: ToolarsStoredAuthSession = {
    ...storedSession,
    revokedAt: options.revokedAt ?? new Date().toISOString(),
    status: "revoked"
  };
  store.sessions[normalizedSessionId] = revokedSession;
  writeSessionLedgerStore(store);
  return { ...revokedSession };
}

export function resolvePersistedToolarsAuthSessionFromRequest(
  request?: Request | null,
  options: ResolveToolarsAuthSessionOptions = {}
) {
  const session = resolveToolarsAuthSessionFromRequest(request, options);
  if (!session) return null;

  const store = readSessionLedgerStore();
  const storedSession = store.sessions[session.sessionId];
  const now = options.now?.() ?? new Date();
  if (!storedSession || storedSession.status !== "active" || storedSession.revokedAt) return null;
  if (Date.parse(storedSession.expiresAt) <= now.getTime()) return null;
  if (!isSameSessionIdentity(session, storedSession)) return null;

  const seenSession: ToolarsStoredAuthSession = {
    ...storedSession,
    lastSeenAt: now.toISOString()
  };
  store.sessions[session.sessionId] = seenSession;
  writeSessionLedgerStore(store);
  return { ...session };
}

export function resetToolarsAuthSessionLedger() {
  writeSessionLedgerStore(createEmptySessionLedgerStore());
}

export function setToolarsAuthSessionLedgerStoragePathForTest(path: string | null) {
  storagePathForTest = path;
}

export function setToolarsAuthSessionLedgerPersistenceDriverForTest(driver: ToolarsAuthSessionLedgerPersistenceDriver | null) {
  persistenceDriverForTest = driver;
}

function readSessionLedgerStore(): ToolarsAuthSessionLedgerStore {
  const persistenceDriver = getSessionLedgerPersistenceDriver();
  if (persistenceDriver) return coerceSessionLedgerStore(persistenceDriver.read());

  const storagePath = getSessionLedgerStoragePath();
  if (!existsSync(/*turbopackIgnore: true*/ storagePath)) return createEmptySessionLedgerStore();

  try {
    const parsed = JSON.parse(readFileSync(/*turbopackIgnore: true*/ storagePath, "utf8")) as Partial<ToolarsAuthSessionLedgerStore>;
    return coerceSessionLedgerStore(parsed);
  } catch {
    return createEmptySessionLedgerStore();
  }
}

function writeSessionLedgerStore(store: ToolarsAuthSessionLedgerStore) {
  const persistenceDriver = getSessionLedgerPersistenceDriver();
  if (persistenceDriver) {
    persistenceDriver.write(cloneSessionLedgerStore(store));
    return;
  }

  const storagePath = getSessionLedgerStoragePath();
  mkdirSync(/*turbopackIgnore: true*/ dirname(storagePath), { recursive: true });
  writeFileSync(/*turbopackIgnore: true*/ storagePath, `${JSON.stringify(store, null, 2)}\n`);
}

function createEmptySessionLedgerStore(): ToolarsAuthSessionLedgerStore {
  return {
    sessions: {},
    version: 1
  };
}

function coerceSessionLedgerStore(store: unknown): ToolarsAuthSessionLedgerStore {
  if (!store || typeof store !== "object") return createEmptySessionLedgerStore();

  const candidate = store as Partial<ToolarsAuthSessionLedgerStore>;
  if (candidate.version !== 1 || !candidate.sessions || typeof candidate.sessions !== "object") {
    return createEmptySessionLedgerStore();
  }

  return {
    sessions: Object.entries(candidate.sessions).reduce<Record<string, ToolarsStoredAuthSession>>(
      (sessions, [sessionId, session]) => {
        const coerced = coerceStoredSession(session);
        if (coerced) sessions[normalizeSessionId(sessionId)] = coerced;
        return sessions;
      },
      {}
    ),
    version: 1
  };
}

function coerceStoredSession(session: unknown): ToolarsStoredAuthSession | null {
  if (!session || typeof session !== "object") return null;

  const candidate = session as Partial<ToolarsStoredAuthSession>;
  if (!candidate.accountId || !candidate.createdAt || !candidate.expiresAt || !candidate.issuedAt || !candidate.sessionId) {
    return null;
  }

  return {
    accountEmail: candidate.accountEmail ?? null,
    accountId: candidate.accountId,
    createdAt: candidate.createdAt,
    expiresAt: candidate.expiresAt,
    issuedAt: candidate.issuedAt,
    lastSeenAt: candidate.lastSeenAt,
    revokedAt: candidate.revokedAt,
    sessionId: normalizeSessionId(candidate.sessionId),
    status: candidate.status === "revoked" ? "revoked" : "active",
    version: 1
  };
}

function cloneSessionLedgerStore(store: ToolarsAuthSessionLedgerStore): ToolarsAuthSessionLedgerStore {
  return {
    sessions: Object.fromEntries(Object.entries(store.sessions).map(([sessionId, session]) => [sessionId, { ...session }])),
    version: 1
  };
}

function isSameSessionIdentity(session: ToolarsAuthSession, storedSession: ToolarsStoredAuthSession) {
  return (
    session.accountId === storedSession.accountId &&
    session.accountEmail === storedSession.accountEmail &&
    session.expiresAt === storedSession.expiresAt &&
    session.issuedAt === storedSession.issuedAt &&
    session.sessionId === storedSession.sessionId
  );
}

function getSessionLedgerPersistenceDriver() {
  return persistenceDriverForTest;
}

function getSessionLedgerStoragePath() {
  return (
    storagePathForTest ??
    getToolarsRuntimeFilePath({
      envKey: "TOOLARS_AUTH_SESSION_LEDGER_PATH",
      fallbackPath: join(".next", "cache", TOOLARS_RUNTIME_FILES.authSessionLedger),
      fileName: TOOLARS_RUNTIME_FILES.authSessionLedger
    })
  );
}

function normalizeSessionId(sessionId: string) {
  return sessionId.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 120) || "session-local";
}
