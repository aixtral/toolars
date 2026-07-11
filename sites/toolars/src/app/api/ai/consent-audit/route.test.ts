import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetServerConsentAuditLedger, setServerConsentAuditLedgerStoragePathForTest } from "@/lib/ai/server-consent-audit-ledger";
import { setToolarsSupabaseServerAuthDriverForTest } from "@/lib/supabase/toolars-supabase-auth-server";
import { DELETE, GET, PATCH, POST } from "./route";

describe("/api/ai/consent-audit", () => {
  let tempDirectory: string;

  beforeEach(() => {
    tempDirectory = mkdtempSync(join(tmpdir(), "toolars-api-audit-"));
    setServerConsentAuditLedgerStoragePathForTest(join(tempDirectory, "ledger.json"));
    resetServerConsentAuditLedger();
  });

  afterEach(() => {
    setServerConsentAuditLedgerStoragePathForTest(null);
    setToolarsSupabaseServerAuthDriverForTest(null);
    rmSync(tempDirectory, { force: true, recursive: true });
  });

  it("persists approved consent events with run metadata in the server ledger", async () => {
    const approvedAt = "2026-06-19T09:02:00Z";
    const response = await POST(
      new Request("http://toolars.test/api/ai/consent-audit", {
        body: JSON.stringify({
          event: {
            approvedAt,
            contentSummary: "Only extracted text from the selected workflow step is sent.",
            providerLabel: "Toolars AI Gateway",
            providerRouteId: "pdf-summary.fast-summary:v1",
            stepId: "summarize-with-ai",
            workflowSlug: "pdf-summary",
            workflowTitle: "PDF Summary Workflow"
          },
          runMetadata: {
            contentBytes: 61,
            createdAt: approvedAt,
            modelFamily: "Fast summary model",
            providerRouteId: "pdf-summary.fast-summary:v1",
            retentionDays: 30,
            runId: "run_pdf-summary_summarize-with-ai_20260619090200Z",
            status: "consent-approved",
            stepId: "summarize-with-ai",
            workflowSlug: "pdf-summary"
          }
        }),
        method: "POST"
      })
    );

    expect(response.status).toBe(201);

    const posted = await response.json();
    expect(posted.ledger.events).toHaveLength(1);
    expect(posted.ledger.runs[0]).toMatchObject({
      contentBytes: 61,
      providerRouteId: "pdf-summary.fast-summary:v1",
      retentionDays: 30,
      runId: "run_pdf-summary_summarize-with-ai_20260619090200Z",
      status: "consent-approved"
    });

    const listResponse = await GET();
    const listed = await listResponse.json();

    expect(listResponse.status).toBe(200);
    expect(listed.ledger.version).toBe(1);
    expect(listed.ledger.events[0].workflowSlug).toBe("pdf-summary");
    expect(listed.ledger.runs[0].modelFamily).toBe("Fast summary model");
  });

  it("clears approved consent events while retaining a deletion audit entry", async () => {
    const approvedAt = "2026-06-19T09:14:00Z";
    await POST(
      new Request("http://toolars.test/api/ai/consent-audit", {
        body: JSON.stringify({
          event: {
            approvedAt,
            contentSummary: "Only extracted text from the selected workflow step is sent.",
            providerLabel: "Toolars AI Gateway",
            providerRouteId: "pdf-summary.fast-summary:v1",
            stepId: "summarize-with-ai",
            workflowSlug: "pdf-summary",
            workflowTitle: "PDF Summary Workflow"
          },
          runMetadata: {
            contentBytes: 61,
            createdAt: approvedAt,
            modelFamily: "Fast summary model",
            providerRouteId: "pdf-summary.fast-summary:v1",
            retentionDays: 30,
            runId: "run_pdf-summary_summarize-with-ai_20260619091400Z",
            status: "consent-approved",
            stepId: "summarize-with-ai",
            workflowSlug: "pdf-summary"
          }
        }),
        method: "POST"
      })
    );

    const response = await DELETE();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.deletion).toMatchObject({
      deletedEvents: 1,
      deletedRuns: 1,
      scope: "ai-history",
      status: "completed"
    });
    expect(payload.ledger.events).toHaveLength(0);
    expect(payload.ledger.runs).toHaveLength(0);
    expect(payload.ledger.deletions).toHaveLength(1);
    expect(payload.ledger.deletions[0].requestedAt).toEqual(expect.any(String));

    const listResponse = await GET();
    const listed = await listResponse.json();

    expect(listed.ledger.events).toHaveLength(0);
    expect(listed.ledger.runs).toHaveLength(0);
    expect(listed.ledger.deletions[0]).toMatchObject({
      deletedEvents: 1,
      deletedRuns: 1,
      status: "completed"
    });
  });

  it("scopes server audit ledgers by workspace identity header", async () => {
    const approvedAt = "2026-06-19T09:32:00Z";

    await POST(
      new Request("http://toolars.test/api/ai/consent-audit", {
        body: JSON.stringify({
          event: {
            approvedAt,
            contentSummary: "Only extracted text from workspace alpha is sent.",
            providerLabel: "Toolars AI Gateway",
            providerRouteId: "pdf-summary.fast-summary:v1",
            stepId: "summarize-with-ai",
            workflowSlug: "pdf-summary",
            workflowTitle: "PDF Summary Workflow"
          },
          runMetadata: {
            contentBytes: 61,
            createdAt: approvedAt,
            modelFamily: "Fast summary model",
            providerRouteId: "pdf-summary.fast-summary:v1",
            retentionDays: 30,
            runId: "run_alpha_pdf-summary_summarize-with-ai_20260619093200Z",
            status: "consent-approved",
            stepId: "summarize-with-ai",
            workflowSlug: "pdf-summary"
          }
        }),
        headers: {
          "x-toolars-workspace-id": "alpha-workspace"
        },
        method: "POST"
      })
    );

    await POST(
      new Request("http://toolars.test/api/ai/consent-audit", {
        body: JSON.stringify({
          event: {
            approvedAt,
            contentSummary: "Only extracted text from workspace beta is sent.",
            providerLabel: "Toolars AI Gateway",
            providerRouteId: "pdf-summary.fast-summary:v1",
            stepId: "summarize-with-ai",
            workflowSlug: "pdf-summary",
            workflowTitle: "PDF Summary Workflow"
          },
          runMetadata: {
            contentBytes: 62,
            createdAt: approvedAt,
            modelFamily: "Fast summary model",
            providerRouteId: "pdf-summary.fast-summary:v1",
            retentionDays: 30,
            runId: "run_beta_pdf-summary_summarize-with-ai_20260619093200Z",
            status: "consent-approved",
            stepId: "summarize-with-ai",
            workflowSlug: "pdf-summary"
          }
        }),
        headers: {
          "x-toolars-workspace-id": "beta-workspace"
        },
        method: "POST"
      })
    );

    const alphaResponse = await GET(
      new Request("http://toolars.test/api/ai/consent-audit", {
        headers: {
          "x-toolars-workspace-id": "alpha-workspace"
        }
      })
    );
    const betaResponse = await GET(
      new Request("http://toolars.test/api/ai/consent-audit", {
        headers: {
          "x-toolars-workspace-id": "beta-workspace"
        }
      })
    );

    const alpha = await alphaResponse.json();
    const beta = await betaResponse.json();

    expect(alpha.ledger.workspaceId).toBe("alpha-workspace");
    expect(alpha.ledger.runs).toHaveLength(1);
    expect(alpha.ledger.runs[0].runId).toContain("run_alpha");
    expect(beta.ledger.workspaceId).toBe("beta-workspace");
    expect(beta.ledger.runs).toHaveLength(1);
    expect(beta.ledger.runs[0].runId).toContain("run_beta");

    await DELETE(
      new Request("http://toolars.test/api/ai/consent-audit", {
        headers: {
          "x-toolars-workspace-id": "alpha-workspace"
        }
      })
    );

    const clearedAlpha = await (
      await GET(
        new Request("http://toolars.test/api/ai/consent-audit", {
          headers: {
            "x-toolars-workspace-id": "alpha-workspace"
          }
        })
      )
    ).json();
    const preservedBeta = await (
      await GET(
        new Request("http://toolars.test/api/ai/consent-audit", {
          headers: {
            "x-toolars-workspace-id": "beta-workspace"
          }
        })
      )
    ).json();

    expect(clearedAlpha.ledger.runs).toHaveLength(0);
    expect(clearedAlpha.ledger.deletions).toHaveLength(1);
    expect(preservedBeta.ledger.runs).toHaveLength(1);
    expect(preservedBeta.ledger.deletions).toHaveLength(0);
  });

  it("binds an anonymous workspace ledger to a future account and lists it by Supabase account", async () => {
    const approvedAt = "2026-06-19T10:18:00Z";

    await POST(
      new Request("http://toolars.test/api/ai/consent-audit", {
        body: JSON.stringify({
          event: {
            approvedAt,
            contentSummary: "Only extracted text from account-bound workspace is sent.",
            providerLabel: "Toolars AI Gateway",
            providerRouteId: "pdf-summary.fast-summary:v1",
            stepId: "summarize-with-ai",
            workflowSlug: "pdf-summary",
            workflowTitle: "PDF Summary Workflow"
          },
          runMetadata: {
            contentBytes: 61,
            createdAt: approvedAt,
            modelFamily: "Fast summary model",
            providerRouteId: "pdf-summary.fast-summary:v1",
            retentionDays: 30,
            runId: "run_account_bound_pdf-summary_summarize-with-ai_20260619101800Z",
            status: "consent-approved",
            stepId: "summarize-with-ai",
            workflowSlug: "pdf-summary"
          }
        }),
        headers: {
          "x-toolars-workspace-id": "anon-workspace-for-account"
        },
        method: "POST"
      })
    );

    const bindingResponse = await PATCH(
      new Request("http://toolars.test/api/ai/consent-audit", {
        body: JSON.stringify({
          accountEmail: "owner@example.com",
          accountId: "acct-preview-123",
          boundAt: "2026-06-19T10:19:00Z"
        }),
        headers: {
          "x-toolars-workspace-id": "anon-workspace-for-account"
        },
        method: "PATCH"
      })
    );

    expect(bindingResponse.status).toBe(200);
    const bindingPayload = await bindingResponse.json();
    expect(bindingPayload.binding).toMatchObject({
      accountEmail: "owner@example.com",
      accountId: "acct-preview-123",
      workspaceId: "anon-workspace-for-account"
    });

    const accountResponse = await GET(
      new Request("http://toolars.test/api/ai/consent-audit")
    );
    setSupabaseUser({ email: "owner@example.com", id: "acct-preview-123" });
    const supabaseAccountResponse = await GET(new Request("http://toolars.test/api/ai/consent-audit"));
    const accountPayload = await accountResponse.json();
    const supabaseAccountPayload = await supabaseAccountResponse.json();

    expect(accountPayload.auth.isAuthenticated).toBe(false);
    expect(accountPayload.ledger.workspaceId).toBe("anonymous-local");
    expect(supabaseAccountPayload.ledger.workspaceId).toBe("account:acct-preview-123");
    expect(supabaseAccountPayload.ledger.accountBindings).toHaveLength(1);
    expect(supabaseAccountPayload.ledger.runs[0].runId).toBe("run_account_bound_pdf-summary_summarize-with-ai_20260619101800Z");
  });

  it("returns resolved auth context metadata with account-scoped ledger reads", async () => {
    setSupabaseUser({ email: "owner@example.com", id: "acct-supabase-123" });
    const response = await GET(
      new Request("http://toolars.test/api/ai/consent-audit", {
        headers: {
          "x-toolars-workspace-id": "anon-workspace-for-auth"
        }
      })
    );
    const payload = await response.json();

    expect(payload.auth).toEqual({
      accountEmail: "owner@example.com",
      accountId: "acct-supabase-123",
      isAuthenticated: true,
      source: "supabase",
      workspaceId: "anon-workspace-for-auth"
    });
    expect(payload.ledger.workspaceId).toBe("account:acct-supabase-123");
  });

  it("returns persisted provider usage analytics with the server audit ledger", async () => {
    const approvedAt = "2026-06-21T10:30:00Z";
    await POST(
      new Request("http://toolars.test/api/ai/consent-audit", {
        body: JSON.stringify({
          event: {
            approvedAt,
            contentSummary: "Only extracted text from provider execution is sent.",
            providerLabel: "Toolars AI Gateway",
            providerRouteId: "pdf-summary.fast-summary:v1",
            stepId: "summarize-with-ai",
            workflowSlug: "pdf-summary",
            workflowTitle: "PDF Summary Workflow"
          },
          runMetadata: {
            completedAt: "2026-06-21T10:31:00Z",
            contentBytes: 61,
            createdAt: approvedAt,
            modelFamily: "Fast summary model",
            modelId: "toolars-fast-summary-2026-06",
            providerRouteId: "pdf-summary.fast-summary:v1",
            providerRunId: "provider_run_usage_123",
            retentionDays: 30,
            runId: "run_pdf-summary_summarize-with-ai_20260621103000Z",
            status: "provider-completed",
            stepId: "summarize-with-ai",
            usage: {
              costUsdCents: 7,
              credits: 3,
              inputTokens: 420,
              outputTokens: 180,
              totalTokens: 600
            },
            workflowSlug: "pdf-summary"
          }
        }),
        headers: {
          "x-toolars-workspace-id": "usage-workspace"
        },
        method: "POST"
      })
    );

    const response = await GET(
      new Request("http://toolars.test/api/ai/consent-audit", {
        headers: {
          "x-toolars-workspace-id": "usage-workspace"
        }
      })
    );
    const payload = await response.json();

    expect(payload.usage).toMatchObject({
      completedRuns: 1,
      costUsdCents: 7,
      credits: 3,
      failedRuns: 0,
      inputTokens: 420,
      outputTokens: 180,
      totalRuns: 1,
      totalTokens: 600
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
