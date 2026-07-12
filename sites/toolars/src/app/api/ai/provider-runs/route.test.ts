import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ToolarsPrivateAuditRecord, ToolarsPrivateDataDriver } from "@/lib/supabase/toolars-private-data";
import { setToolarsPrivateDataDriverForTest } from "@/lib/supabase/toolars-private-data";
import { setToolarsSupabaseServerAuthDriverForTest } from "@/lib/supabase/toolars-supabase-auth-server";
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
  let recordsByUser: Map<string, ToolarsPrivateAuditRecord[]>;
  const originalEndpoint = process.env.TOOLARS_AI_PROVIDER_ENDPOINT;
  const originalApiKey = process.env.TOOLARS_AI_PROVIDER_API_KEY;

  beforeEach(() => {
    recordsByUser = new Map();
    process.env.TOOLARS_AI_PROVIDER_ENDPOINT = "https://ai-provider.toolars.test";
    process.env.TOOLARS_AI_PROVIDER_API_KEY = "ai-provider-secret";
    setToolarsPrivateDataDriverForTest(createAuditDriver(recordsByUser));
    setSupabaseUser({ email: "owner@example.com", id: "user_provider_owner" });
  });

  afterEach(() => {
    process.env.TOOLARS_AI_PROVIDER_ENDPOINT = originalEndpoint;
    process.env.TOOLARS_AI_PROVIDER_API_KEY = originalApiKey;
    setToolarsPrivateDataDriverForTest(null);
    setToolarsSupabaseServerAuthDriverForTest(null);
    vi.unstubAllGlobals();
  });

  it("executes the configured AI provider and records usage analytics in the server ledger", async () => {
    setSupabaseUser({ email: "owner@example.com", id: "user_ai_owner" });
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
        },
        method: "POST"
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(fetchMock).toHaveBeenCalledWith("https://ai-provider.toolars.test/runs", {
      body: JSON.stringify({
        accountId: "user_ai_owner",
        contentSummary: event.contentSummary,
        prompt: "Summarize the extracted text.",
        providerRouteId: "pdf-summary.fast-summary:v1",
        runId: "run_pdf-summary_summarize-with-ai_20260621T101000Z",
        stepId: "summarize-with-ai",
        workflowSlug: "pdf-summary",
        workspaceId: "user:user_ai_owner"
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

  it("rejects an unauthenticated provider run before calling the configured provider", async () => {
    setToolarsSupabaseServerAuthDriverForTest(null);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new Request("http://toolars.test/api/ai/provider-runs", {
        body: JSON.stringify({ event, prompt: "Summarize.", runMetadata }),
        headers: { "Content-Type": "application/json", "x-toolars-workspace-id": "victim-workspace" },
        method: "POST"
      })
    );

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
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

function setSupabaseUser(user: { email: string; id: string }) {
  setToolarsSupabaseServerAuthDriverForTest({
    getUser: vi.fn().mockResolvedValue({
      data: { user },
      error: null
    }),
    signOut: vi.fn()
  });
}

function createAuditDriver(recordsByUser: Map<string, ToolarsPrivateAuditRecord[]>): ToolarsPrivateDataDriver {
  return {
    async createAuditRecord({ event, runMetadata, userId }) {
      const record = { createdAt: new Date().toISOString(), event, runMetadata };
      recordsByUser.set(userId, [...(recordsByUser.get(userId) ?? []), record]);
      return record;
    },
    async listAuditRecords({ userId }) { return recordsByUser.get(userId) ?? []; },
    async deleteAuditRecords() { return { deletedRecords: 0 }; },
    async createPdfUpload() { throw new Error("not used"); },
    async listPdfUploads() { return []; },
    async getPdfUpload() { return null; },
    async deletePdfUpload() { return false; }
  };
}
