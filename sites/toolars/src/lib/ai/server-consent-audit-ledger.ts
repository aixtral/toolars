import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { getToolarsRuntimeFilePath, TOOLARS_RUNTIME_FILES } from "@/lib/ops/toolars-runtime-config";
import type { AiConsentAuditEvent } from "./consent-audit-storage";
import type { AiConsentRunMetadata, AiConsentRunUsage } from "./consent-audit-run-metadata";

export const DEFAULT_AI_AUDIT_WORKSPACE_ID = "anonymous-local";

export interface ServerConsentAuditLedger {
  accountBindings: ServerConsentAccountBinding[];
  deletions: AiConsentDeletionAuditEntry[];
  events: AiConsentAuditEvent[];
  runs: AiConsentRunMetadata[];
  version: 1;
  workspaceId: string;
}

export interface ServerConsentAccountBinding {
  accountEmail?: string;
  accountId: string;
  boundAt: string;
  source: "future-login";
  workspaceId: string;
}

export interface AiConsentDeletionAuditEntry {
  deletedEvents: number;
  deletedRuns: number;
  requestedAt: string;
  scope: "ai-history";
  status: "completed";
}

export interface ServerConsentAuditLedgerStore {
  ledgers: Record<string, ServerConsentAuditLedger>;
  version: 1;
}

export interface ServerConsentUsageAnalytics {
  completedRuns: number;
  costUsdCents: number;
  credits: number;
  failedRuns: number;
  inputTokens: number;
  outputTokens: number;
  totalRuns: number;
  totalTokens: number;
}

export interface ServerConsentAuditLedgerPersistenceDriver {
  read: () => ServerConsentAuditLedgerStore | null;
  write: (store: ServerConsentAuditLedgerStore) => void;
}

let persistenceDriverForTest: ServerConsentAuditLedgerPersistenceDriver | null = null;
let storagePathForTest: string | null = null;

export function getServerConsentAuditLedger(workspaceId = DEFAULT_AI_AUDIT_WORKSPACE_ID): ServerConsentAuditLedger {
  const normalizedWorkspaceId = normalizeWorkspaceId(workspaceId);
  const store = readLedgerStore();
  return cloneLedger(store.ledgers[normalizedWorkspaceId] ?? createEmptyServerLedger(normalizedWorkspaceId));
}

export function getServerConsentAuditLedgerForAccount(accountId: string): ServerConsentAuditLedger {
  const normalizedAccountId = normalizeAccountId(accountId);
  const store = readLedgerStore();
  const accountLedgers = Object.values(store.ledgers).filter((ledger) =>
    ledger.accountBindings.some((binding) => binding.accountId === normalizedAccountId)
  );

  return cloneLedger({
    accountBindings: dedupeAccountBindings(accountLedgers.flatMap((ledger) => ledger.accountBindings)),
    deletions: accountLedgers.flatMap((ledger) => ledger.deletions),
    events: accountLedgers.flatMap((ledger) => ledger.events),
    runs: accountLedgers.flatMap((ledger) => ledger.runs),
    version: 1,
    workspaceId: `account:${normalizedAccountId}`
  });
}

export function appendServerConsentAuditRecord({
  accountId,
  event,
  runMetadata,
  workspaceId = DEFAULT_AI_AUDIT_WORKSPACE_ID
}: {
  accountId?: string | null;
  event: AiConsentAuditEvent;
  runMetadata: AiConsentRunMetadata;
  workspaceId?: string;
}): ServerConsentAuditLedger {
  if (!isAiConsentAuditEvent(event) || !isAiConsentRunMetadata(runMetadata)) {
    throw new Error("Invalid AI consent audit record");
  }

  const normalizedWorkspaceId = normalizeWorkspaceId(workspaceId);
  const store = readLedgerStore();
  const currentLedger = store.ledgers[normalizedWorkspaceId] ?? createEmptyServerLedger(normalizedWorkspaceId);
  const nextLedger: ServerConsentAuditLedger = {
    accountBindings: [...currentLedger.accountBindings],
    deletions: [...currentLedger.deletions],
    events: [...currentLedger.events, event],
    runs: [...currentLedger.runs, runMetadata],
    version: 1,
    workspaceId: normalizedWorkspaceId
  };
  store.ledgers[normalizedWorkspaceId] = nextLedger;
  writeLedgerStore(store);

  if (accountId) {
    return bindServerConsentAuditWorkspaceToAccount({
      accountId,
      workspaceId: normalizedWorkspaceId
    }).ledger;
  }

  return cloneLedger(nextLedger);
}

export function bindServerConsentAuditWorkspaceToAccount({
  accountEmail,
  accountId,
  boundAt = new Date().toISOString(),
  workspaceId = DEFAULT_AI_AUDIT_WORKSPACE_ID
}: {
  accountEmail?: string;
  accountId: string;
  boundAt?: string;
  workspaceId?: string;
}) {
  const normalizedWorkspaceId = normalizeWorkspaceId(workspaceId);
  const normalizedAccountId = normalizeAccountId(accountId);
  const store = readLedgerStore();
  const currentLedger = store.ledgers[normalizedWorkspaceId] ?? createEmptyServerLedger(normalizedWorkspaceId);
  const binding: ServerConsentAccountBinding = {
    accountId: normalizedAccountId,
    boundAt,
    source: "future-login",
    workspaceId: normalizedWorkspaceId
  };

  if (accountEmail?.trim()) {
    binding.accountEmail = accountEmail.trim();
  }

  const nextBindings = [
    ...currentLedger.accountBindings.filter((item) => item.accountId !== normalizedAccountId),
    binding
  ];
  const nextLedger: ServerConsentAuditLedger = {
    ...currentLedger,
    accountBindings: nextBindings,
    workspaceId: normalizedWorkspaceId
  };

  store.ledgers[normalizedWorkspaceId] = nextLedger;
  writeLedgerStore(store);

  return {
    binding: { ...binding },
    ledger: cloneLedger(nextLedger)
  };
}

export function clearServerConsentAuditLedger(
  options: { requestedAt?: string; workspaceId?: string } | string = {}
) {
  const requestedAt = typeof options === "string" ? options : options.requestedAt ?? new Date().toISOString();
  const normalizedWorkspaceId = normalizeWorkspaceId(typeof options === "string" ? undefined : options.workspaceId);
  const store = readLedgerStore();
  const currentLedger = store.ledgers[normalizedWorkspaceId] ?? createEmptyServerLedger(normalizedWorkspaceId);
  const deletion: AiConsentDeletionAuditEntry = {
    deletedEvents: currentLedger.events.length,
    deletedRuns: currentLedger.runs.length,
    requestedAt,
    scope: "ai-history",
    status: "completed"
  };

  const nextLedger: ServerConsentAuditLedger = {
    accountBindings: [...currentLedger.accountBindings],
    deletions: [...currentLedger.deletions, deletion],
    events: [],
    runs: [],
    version: 1,
    workspaceId: normalizedWorkspaceId
  };
  store.ledgers[normalizedWorkspaceId] = nextLedger;
  writeLedgerStore(store);

  return {
    deletion: { ...deletion },
    ledger: cloneLedger(nextLedger)
  };
}

export function summarizeServerConsentUsageAnalytics(ledger: Pick<ServerConsentAuditLedger, "runs">): ServerConsentUsageAnalytics {
  return ledger.runs.reduce<ServerConsentUsageAnalytics>(
    (usage, run) => {
      usage.totalRuns += 1;
      if (run.status === "provider-completed") usage.completedRuns += 1;
      if (run.status === "provider-failed") usage.failedRuns += 1;

      usage.inputTokens += run.usage?.inputTokens ?? 0;
      usage.outputTokens += run.usage?.outputTokens ?? 0;
      usage.totalTokens += run.usage?.totalTokens ?? 0;
      usage.credits += run.usage?.credits ?? 0;
      usage.costUsdCents += run.usage?.costUsdCents ?? 0;
      return usage;
    },
    {
      completedRuns: 0,
      costUsdCents: 0,
      credits: 0,
      failedRuns: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalRuns: 0,
      totalTokens: 0
    }
  );
}

export function resetServerConsentAuditLedger(workspaceId?: string) {
  if (workspaceId) {
    const store = readLedgerStore();
    delete store.ledgers[normalizeWorkspaceId(workspaceId)];
    writeLedgerStore(store);
    return;
  }

  writeLedgerStore(createEmptyLedgerStore());
}

export function resolveServerConsentAuditWorkspaceId(request?: Request | null) {
  return normalizeWorkspaceId(request?.headers.get("x-toolars-workspace-id"));
}

export function resolveServerConsentAuditAccountId(request?: Request | null) {
  const accountId = request?.headers.get("x-toolars-account-id");
  return accountId ? normalizeAccountId(accountId) : null;
}

export function setServerConsentAuditLedgerStoragePathForTest(path: string | null) {
  storagePathForTest = path;
}

export function setServerConsentAuditLedgerPersistenceDriverForTest(driver: ServerConsentAuditLedgerPersistenceDriver | null) {
  persistenceDriverForTest = driver;
}

function cloneLedger(ledger: ServerConsentAuditLedger): ServerConsentAuditLedger {
  return {
    accountBindings: ledger.accountBindings.map((binding) => ({ ...binding })),
    deletions: ledger.deletions.map((deletion) => ({ ...deletion })),
    events: ledger.events.map((event) => ({ ...event })),
    runs: ledger.runs.map((run) => ({ ...run })),
    version: 1,
    workspaceId: ledger.workspaceId
  };
}

function createEmptyLedgerStore(): ServerConsentAuditLedgerStore {
  return {
    ledgers: {},
    version: 1
  };
}

function createEmptyServerLedger(workspaceId = DEFAULT_AI_AUDIT_WORKSPACE_ID): ServerConsentAuditLedger {
  return {
    accountBindings: [],
    deletions: [],
    events: [],
    runs: [],
    version: 1,
    workspaceId: normalizeWorkspaceId(workspaceId)
  };
}

function readLedgerStore(): ServerConsentAuditLedgerStore {
  const persistenceDriver = getLedgerPersistenceDriver();
  if (persistenceDriver) {
    return coerceLedgerStore(persistenceDriver.read());
  }

  const storagePath = getLedgerStoragePath();
  if (!existsSync(/*turbopackIgnore: true*/ storagePath)) return createEmptyLedgerStore();

  try {
    const parsed = JSON.parse(readFileSync(/*turbopackIgnore: true*/ storagePath, "utf8")) as Partial<ServerConsentAuditLedgerStore>;
    if (parsed.version !== 1 || !parsed.ledgers || typeof parsed.ledgers !== "object") {
      return createEmptyLedgerStore();
    }

    return coerceLedgerStore(parsed);
  } catch {
    return createEmptyLedgerStore();
  }
}

function writeLedgerStore(store: ServerConsentAuditLedgerStore) {
  const persistenceDriver = getLedgerPersistenceDriver();
  if (persistenceDriver) {
    persistenceDriver.write(cloneLedgerStore(store));
    return;
  }

  const storagePath = getLedgerStoragePath();
  const storageDirectory = dirname(storagePath);
  mkdirSync(/*turbopackIgnore: true*/ storageDirectory, { recursive: true });
  writeFileSync(/*turbopackIgnore: true*/ storagePath, `${JSON.stringify(store, null, 2)}\n`);
}

function getLedgerPersistenceDriver() {
  return persistenceDriverForTest;
}

function getLedgerStoragePath() {
  return (
    storagePathForTest ??
    getToolarsRuntimeFilePath({
      envKey: "TOOLARS_AI_CONSENT_LEDGER_PATH",
      fallbackPath: join(".next", "cache", TOOLARS_RUNTIME_FILES.aiConsentLedger),
      fileName: TOOLARS_RUNTIME_FILES.aiConsentLedger
    })
  );
}

function cloneLedgerStore(store: ServerConsentAuditLedgerStore): ServerConsentAuditLedgerStore {
  return {
    ledgers: Object.fromEntries(
      Object.entries(store.ledgers).map(([workspaceId, ledger]) => [workspaceId, cloneLedger(ledger)])
    ),
    version: 1
  };
}

function coerceLedgerStore(store: unknown): ServerConsentAuditLedgerStore {
  if (!store || typeof store !== "object") return createEmptyLedgerStore();

  const candidate = store as Partial<ServerConsentAuditLedgerStore>;
  if (candidate.version !== 1 || !candidate.ledgers || typeof candidate.ledgers !== "object") {
    return createEmptyLedgerStore();
  }

  const ledgers = Object.entries(candidate.ledgers).reduce<Record<string, ServerConsentAuditLedger>>((nextLedgers, [workspaceId, ledger]) => {
    const normalizedWorkspaceId = normalizeWorkspaceId(workspaceId);
    nextLedgers[normalizedWorkspaceId] = coerceServerLedger(ledger, normalizedWorkspaceId);
    return nextLedgers;
  }, {});

  return {
    ledgers,
    version: 1
  };
}

function coerceServerLedger(ledger: unknown, workspaceId: string): ServerConsentAuditLedger {
  if (!ledger || typeof ledger !== "object") return createEmptyServerLedger(workspaceId);

  const candidate = ledger as Partial<ServerConsentAuditLedger>;
  return {
    accountBindings: Array.isArray(candidate.accountBindings)
      ? candidate.accountBindings.filter(isServerConsentAccountBinding)
      : [],
    deletions: Array.isArray(candidate.deletions) ? candidate.deletions.filter(isAiConsentDeletionAuditEntry) : [],
    events: Array.isArray(candidate.events) ? candidate.events.filter(isAiConsentAuditEvent) : [],
    runs: Array.isArray(candidate.runs) ? candidate.runs.filter(isAiConsentRunMetadata) : [],
    version: 1,
    workspaceId
  };
}

function normalizeWorkspaceId(workspaceId?: string | null) {
  const normalized = workspaceId?.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 80);
  return normalized || DEFAULT_AI_AUDIT_WORKSPACE_ID;
}

function normalizeAccountId(accountId: string) {
  return accountId.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 80) || "account-local";
}

function dedupeAccountBindings(bindings: ServerConsentAccountBinding[]) {
  return Array.from(
    bindings
      .reduce<Map<string, ServerConsentAccountBinding>>((nextBindings, binding) => {
        nextBindings.set(`${binding.accountId}:${binding.workspaceId}`, binding);
        return nextBindings;
      }, new Map())
      .values()
  );
}

function isServerConsentAccountBinding(binding: unknown): binding is ServerConsentAccountBinding {
  if (!binding || typeof binding !== "object") return false;

  const candidate = binding as Partial<ServerConsentAccountBinding>;
  return Boolean(candidate.accountId && candidate.boundAt && candidate.source === "future-login" && candidate.workspaceId);
}

function isAiConsentDeletionAuditEntry(deletion: unknown): deletion is AiConsentDeletionAuditEntry {
  if (!deletion || typeof deletion !== "object") return false;

  const candidate = deletion as Partial<AiConsentDeletionAuditEntry>;
  return Boolean(
    candidate.deletedEvents !== undefined &&
      candidate.deletedRuns !== undefined &&
      candidate.requestedAt &&
      candidate.scope === "ai-history" &&
      candidate.status === "completed"
  );
}

function isAiConsentAuditEvent(event: unknown): event is AiConsentAuditEvent {
  if (!event || typeof event !== "object") return false;

  const candidate = event as Partial<AiConsentAuditEvent>;
  return Boolean(
    candidate.approvedAt &&
      candidate.contentSummary &&
      candidate.providerLabel &&
      candidate.providerRouteId &&
      candidate.stepId &&
      candidate.workflowSlug &&
      candidate.workflowTitle
  );
}

function isAiConsentRunMetadata(run: unknown): run is AiConsentRunMetadata {
  if (!run || typeof run !== "object") return false;

  const candidate = run as Partial<AiConsentRunMetadata>;
  return Boolean(
      candidate.contentBytes !== undefined &&
      candidate.createdAt &&
      candidate.modelFamily &&
      candidate.providerRouteId &&
      candidate.retentionDays !== undefined &&
      candidate.runId &&
      isAiConsentRunStatus(candidate.status) &&
      isAiConsentRunUsage(candidate.usage) &&
      candidate.stepId &&
      candidate.workflowSlug
  );
}

function isAiConsentRunStatus(status: unknown) {
  return status === "consent-approved" || status === "provider-completed" || status === "provider-failed";
}

function isAiConsentRunUsage(usage: unknown): usage is AiConsentRunUsage | undefined {
  if (usage === undefined) return true;
  if (!usage || typeof usage !== "object") return false;

  const candidate = usage as Partial<AiConsentRunUsage>;
  return (
    candidate.costUsdCents !== undefined &&
    candidate.credits !== undefined &&
    candidate.inputTokens !== undefined &&
    candidate.outputTokens !== undefined &&
    candidate.totalTokens !== undefined
  );
}
