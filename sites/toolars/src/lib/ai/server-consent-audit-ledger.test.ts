import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  appendServerConsentAuditRecord,
  bindServerConsentAuditWorkspaceToAccount,
  clearServerConsentAuditLedger,
  getServerConsentAuditLedgerForAccount,
  getServerConsentAuditLedger,
  resetServerConsentAuditLedger,
  setServerConsentAuditLedgerPersistenceDriverForTest,
  setServerConsentAuditLedgerStoragePathForTest
} from "./server-consent-audit-ledger";
import type { ServerConsentAuditLedgerStore } from "./server-consent-audit-ledger";

const event = {
  approvedAt: "2026-06-19T09:40:00Z",
  contentSummary: "Only extracted text from the selected workflow step is sent.",
  providerLabel: "Toolars AI Gateway",
  providerRouteId: "pdf-summary.fast-summary:v1",
  stepId: "summarize-with-ai",
  workflowSlug: "pdf-summary",
  workflowTitle: "PDF Summary Workflow"
};

const runMetadata = {
  contentBytes: 61,
  createdAt: "2026-06-19T09:40:00Z",
  modelFamily: "Fast summary model",
  providerRouteId: "pdf-summary.fast-summary:v1",
  retentionDays: 30,
  runId: "run_pdf-summary_summarize-with-ai_20260619094000Z",
  status: "consent-approved" as const,
  stepId: "summarize-with-ai",
  workflowSlug: "pdf-summary"
};

describe("server consent audit ledger", () => {
  let tempDirectory: string;
  let ledgerPath: string;

  beforeEach(() => {
    tempDirectory = mkdtempSync(join(tmpdir(), "toolars-ai-audit-"));
    ledgerPath = join(tempDirectory, "ledger.json");
    setServerConsentAuditLedgerStoragePathForTest(ledgerPath);
    resetServerConsentAuditLedger();
  });

  afterEach(() => {
    setServerConsentAuditLedgerPersistenceDriverForTest(null);
    setServerConsentAuditLedgerStoragePathForTest(null);
    rmSync(tempDirectory, { force: true, recursive: true });
  });

  it("persists workspace ledgers into a configured JSON store", () => {
    appendServerConsentAuditRecord({
      event,
      runMetadata,
      workspaceId: "alpha-workspace"
    });

    expect(existsSync(ledgerPath)).toBe(true);

    const rawLedger = JSON.parse(readFileSync(ledgerPath, "utf8"));
    expect(rawLedger).toMatchObject({
      ledgers: {
        "alpha-workspace": {
          events: [expect.objectContaining({ workflowSlug: "pdf-summary" })],
          runs: [expect.objectContaining({ runId: "run_pdf-summary_summarize-with-ai_20260619094000Z" })],
          version: 1,
          workspaceId: "alpha-workspace"
        }
      },
      version: 1
    });

    expect(getServerConsentAuditLedger("alpha-workspace").runs[0].runId).toBe("run_pdf-summary_summarize-with-ai_20260619094000Z");
  });

  it("clears only the requested workspace and preserves other workspace audit runs", () => {
    appendServerConsentAuditRecord({ event, runMetadata, workspaceId: "alpha-workspace" });
    appendServerConsentAuditRecord({
      event: { ...event, contentSummary: "Only extracted text from the beta workspace is sent." },
      runMetadata: { ...runMetadata, contentBytes: 62, runId: "run_beta_pdf-summary_summarize-with-ai_20260619094000Z" },
      workspaceId: "beta-workspace"
    });

    const { deletion, ledger } = clearServerConsentAuditLedger({
      requestedAt: "2026-06-19T09:41:00Z",
      workspaceId: "alpha-workspace"
    });

    expect(deletion).toMatchObject({
      deletedEvents: 1,
      deletedRuns: 1,
      scope: "ai-history",
      status: "completed"
    });
    expect(ledger.workspaceId).toBe("alpha-workspace");
    expect(ledger.events).toHaveLength(0);
    expect(ledger.runs).toHaveLength(0);
    expect(ledger.deletions).toHaveLength(1);

    const betaLedger = getServerConsentAuditLedger("beta-workspace");
    expect(betaLedger.events).toHaveLength(1);
    expect(betaLedger.runs[0].runId).toContain("run_beta");
    expect(betaLedger.deletions).toHaveLength(0);
  });

  it("binds an anonymous workspace ledger to a future account scope", () => {
    appendServerConsentAuditRecord({ event, runMetadata, workspaceId: "anon-workspace" });

    const { binding, ledger } = bindServerConsentAuditWorkspaceToAccount({
      accountEmail: "owner@example.com",
      accountId: "acct-preview-123",
      boundAt: "2026-06-19T10:15:00Z",
      workspaceId: "anon-workspace"
    });

    expect(binding).toEqual({
      accountEmail: "owner@example.com",
      accountId: "acct-preview-123",
      boundAt: "2026-06-19T10:15:00Z",
      source: "future-login",
      workspaceId: "anon-workspace"
    });
    expect(ledger.accountBindings).toEqual([binding]);

    const accountLedger = getServerConsentAuditLedgerForAccount("acct-preview-123");

    expect(accountLedger.workspaceId).toBe("account:acct-preview-123");
    expect(accountLedger.accountBindings).toEqual([binding]);
    expect(accountLedger.runs).toHaveLength(1);
    expect(accountLedger.runs[0].runId).toBe("run_pdf-summary_summarize-with-ai_20260619094000Z");
  });

  it("can persist through an injected database-style ledger driver", () => {
    const writes: ServerConsentAuditLedgerStore[] = [];
    rmSync(ledgerPath, { force: true });
    setServerConsentAuditLedgerPersistenceDriverForTest({
      read: () => writes.at(-1) ?? null,
      write: (store) => {
        writes.push(structuredClone(store));
      }
    });
    resetServerConsentAuditLedger();

    appendServerConsentAuditRecord({
      event,
      runMetadata,
      workspaceId: "db-workspace"
    });

    expect(writes.at(-1)?.ledgers["db-workspace"].runs[0].runId).toBe("run_pdf-summary_summarize-with-ai_20260619094000Z");
    expect(getServerConsentAuditLedger("db-workspace").events).toHaveLength(1);
    expect(existsSync(ledgerPath)).toBe(false);
  });

  it("uses TOOLARS_AI_CONSENT_LEDGER_PATH for production runtime persistence", () => {
    const originalLedgerPath = process.env.TOOLARS_AI_CONSENT_LEDGER_PATH;
    const runtimePath = join(tempDirectory, "runtime", "ai-ledger.json");
    setServerConsentAuditLedgerStoragePathForTest(null);
    process.env.TOOLARS_AI_CONSENT_LEDGER_PATH = runtimePath;

    try {
      resetServerConsentAuditLedger();
      appendServerConsentAuditRecord({
        event,
        runMetadata,
        workspaceId: "runtime-workspace"
      });

      expect(existsSync(runtimePath)).toBe(true);
      expect(JSON.parse(readFileSync(runtimePath, "utf8"))).toMatchObject({
        ledgers: {
          "runtime-workspace": {
            runs: [expect.objectContaining({ runId: "run_pdf-summary_summarize-with-ai_20260619094000Z" })],
            workspaceId: "runtime-workspace"
          }
        },
        version: 1
      });
    } finally {
      process.env.TOOLARS_AI_CONSENT_LEDGER_PATH = originalLedgerPath;
    }
  });
});
