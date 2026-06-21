import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetServerConsentAuditLedger, setServerConsentAuditLedgerStoragePathForTest } from "@/lib/ai/server-consent-audit-ledger";
import { createToolarsAuthSessionCookie } from "@/lib/auth/toolars-auth-session";
import {
  persistToolarsAuthSession,
  resetToolarsAuthSessionLedger,
  setToolarsAuthSessionLedgerStoragePathForTest
} from "@/lib/auth/toolars-auth-session-ledger";
import { POST } from "./route";

const event = {
  approvedAt: "2026-06-21T10:10:00Z",
  contentSummary: "Only extracted text from the selected workflow step is sent.",
  providerLabel: "Toolars AI Gateway",
  providerRouteId: "pdf-summary.fast-summary:v1",
  stepId: "summarize-with-ai",
  workflowSlug: "pdf-summary",
  workflowTitle: "PDF Summary Workflow"
};

const runMetadata = {
  contentBytes: 61,
  createdAt: "2026-06-21T10:10:00Z",
  modelFamily: "Fast summary model",
  providerRouteId: "pdf-summary.fast-summary:v1",
  retentionDays: 30,
  runId: "run_pdf-summary_summarize-with-ai_20260621T101000Z",
  status: "consent-approved" as const,
  stepId: "summarize-with-ai",
  workflowSlug: "pdf-summary"
};

describe("/api/ai/provider-runs", () => {
  let tempDirectory: string;
  const originalEndpoint = process.env.TOOLARS_AI_PROVIDER_ENDPOINT;
  const originalApiKey = process.env.TOOLARS_AI_PROVIDER_API_KEY;
  const originalSessionSecret = process.env.TOOLARS_AUTH_SESSION_SECRET;

  beforeEach(() => {
    tempDirectory = mkdtempSync(join(tmpdir(), "toolars-api-provider-run-"));
    process.env.TOOLARS_AI_PROVIDER_ENDPOINT = "https://ai-provider.toolars.test";
    process.env.TOOLARS_AI_PROVIDER_API_KEY = "ai-provider-secret";
    process.env.TOOLARS_AUTH_SESSION_SECRET = "test-session-secret";
    setServerConsentAuditLedgerStoragePathForTest(join(tempDirectory, "ledger.json"));
    setToolarsAuthSessionLedgerStoragePathForTest(join(tempDirectory, "sessions.json"));
    resetServerConsentAuditLedger();
    resetToolarsAuthSessionLedger();
  });

  afterEach(() => {
    process.env.TOOLARS_AI_PROVIDER_ENDPOINT = originalEndpoint;
    process.env.TOOLARS_AI_PROVIDER_API_KEY = originalApiKey;
    process.env.TOOLARS_AUTH_SESSION_SECRET = originalSessionSecret;
    setServerConsentAuditLedgerStoragePathForTest(null);
    setToolarsAuthSessionLedgerStoragePathForTest(null);
    vi.unstubAllGlobals();
    rmSync(tempDirectory, { force: true, recursive: true });
  });

  it("executes the configured AI provider and records usage analytics in the server ledger", async () => {
    const { cookie, session } = createToolarsAuthSessionCookie({
      accountEmail: "owner@example.com",
      accountId: "acct_ai_owner",
      expiresAt: "2026-06-21T11:00:00Z",
      issuedAt: "2026-06-21T10:00:00Z",
      secret: "test-session-secret",
      sessionId: "sess_ai_provider"
    });
    persistToolarsAuthSession(session);
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        modelId: "toolars-fast-summary-2026-06",
        outputText: "Board pack summary with action items.",
        providerRunId: "provider_run_123",
        usage: {
          costUsdCents: 4,
          credits: 2,
          inputTokens: 240,
          outputTokens: 96,
          totalTokens: 336
        }
      }),
      ok: true
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new Request("http://toolars.test/api/ai/provider-runs", {
        body: JSON.stringify({
          event,
          prompt: "Summarize the extracted text.",
          runMetadata
        }),
        headers: {
          "Content-Type": "application/json",
          cookie,
          "x-toolars-workspace-id": "toolars_ws_ai_provider_test"
        },
        method: "POST"
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(fetchMock).toHaveBeenCalledWith("https://ai-provider.toolars.test/runs", {
      body: JSON.stringify({
        accountId: "acct_ai_owner",
        contentSummary: event.contentSummary,
        prompt: "Summarize the extracted text.",
        providerRouteId: "pdf-summary.fast-summary:v1",
        runId: "run_pdf-summary_summarize-with-ai_20260621T101000Z",
        stepId: "summarize-with-ai",
        workflowSlug: "pdf-summary",
        workspaceId: "toolars_ws_ai_provider_test"
      }),
      headers: {
        Accept: "application/json",
        Authorization: "Bearer ai-provider-secret",
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    expect(payload.run).toMatchObject({
      modelId: "toolars-fast-summary-2026-06",
      providerRunId: "provider_run_123",
      status: "provider-completed",
      usage: {
        costUsdCents: 4,
        credits: 2,
        inputTokens: 240,
        outputTokens: 96,
        totalTokens: 336
      }
    });
    expect(payload.outputText).toBe("Board pack summary with action items.");
    expect(payload.ledger.runs[0]).toMatchObject({
      providerRunId: "provider_run_123",
      status: "provider-completed",
      usage: {
        totalTokens: 336
      }
    });
    expect(payload.usage).toMatchObject({
      completedRuns: 1,
      costUsdCents: 4,
      credits: 2,
      totalTokens: 336
    });
  });

  it("records provider failures with model route metadata and returns a provider error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503
      })
    );

    const response = await POST(
      new Request("http://toolars.test/api/ai/provider-runs", {
        body: JSON.stringify({
          event,
          prompt: "Summarize the extracted text.",
          runMetadata
        }),
        headers: {
          "Content-Type": "application/json",
          "x-toolars-workspace-id": "toolars_ws_ai_failure_test"
        },
        method: "POST"
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe("AI provider execution failed");
    expect(payload.run).toMatchObject({
      failureReason: "Provider returned 503",
      providerRouteId: "pdf-summary.fast-summary:v1",
      status: "provider-failed"
    });
    expect(payload.usage).toMatchObject({
      failedRuns: 1,
      totalRuns: 1
    });
  });
});
