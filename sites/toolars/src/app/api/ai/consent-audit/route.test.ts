import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ToolarsPrivateAuditRecord, ToolarsPrivateDataDriver } from "@/lib/supabase/toolars-private-data";
import { setToolarsPrivateDataDriverForTest } from "@/lib/supabase/toolars-private-data";
import { setToolarsSupabaseServerAuthDriverForTest } from "@/lib/supabase/toolars-supabase-auth-server";
import { DELETE, GET, PATCH, POST } from "./route";

const event = {
  approvedAt: "2026-07-12T10:00:00Z",
  contentSummary: "Selected workflow text only.",
  providerLabel: "Toolars AI Gateway",
  providerRouteId: "pdf-summary.fast-summary:v1",
  stepId: "summarize-with-ai",
  workflowSlug: "pdf-summary",
  workflowTitle: "PDF Summary Workflow"
};

const runMetadata = {
  contentBytes: 61,
  createdAt: "2026-07-12T10:00:00Z",
  modelFamily: "Fast summary model",
  providerRouteId: "pdf-summary.fast-summary:v1",
  retentionDays: 30,
  runId: "run_pdf-summary_20260712T100000Z",
  status: "consent-approved" as const,
  stepId: "summarize-with-ai",
  workflowSlug: "pdf-summary"
};

describe("/api/ai/consent-audit", () => {
  let recordsByUser: Map<string, ToolarsPrivateAuditRecord[]>;

  beforeEach(() => {
    recordsByUser = new Map();
    setToolarsPrivateDataDriverForTest(createAuditDriver(recordsByUser));
    setSupabaseUser("audit-owner");
  });

  afterEach(() => {
    setToolarsPrivateDataDriverForTest(null);
    setToolarsSupabaseServerAuthDriverForTest(null);
  });

  it("rejects anonymous access even when a client forges a workspace header", async () => {
    setToolarsSupabaseServerAuthDriverForTest(null);

    const response = await POST(
      new Request("http://toolars.test/api/ai/consent-audit", {
        body: JSON.stringify({ event, runMetadata }),
        headers: { "Content-Type": "application/json", "x-toolars-workspace-id": "victim-workspace" },
        method: "POST"
      })
    );

    expect(response.status).toBe(401);
    expect(recordsByUser.size).toBe(0);
  });

  it("persists and reads audit data by the authenticated Supabase user, not the workspace header", async () => {
    const postResponse = await POST(
      new Request("http://toolars.test/api/ai/consent-audit", {
        body: JSON.stringify({ event, runMetadata }),
        headers: { "Content-Type": "application/json", "x-toolars-workspace-id": "shared-or-forged" },
        method: "POST"
      })
    );
    expect(postResponse.status).toBe(201);

    setSupabaseUser("another-user");
    const otherUserResponse = await GET(new Request("http://toolars.test/api/ai/consent-audit", { headers: { "x-toolars-workspace-id": "shared-or-forged" } }));
    expect((await otherUserResponse.json()).ledger.events).toHaveLength(0);

    setSupabaseUser("audit-owner");
    const ownerResponse = await GET(new Request("http://toolars.test/api/ai/consent-audit"));
    const ownerPayload = await ownerResponse.json();
    expect(ownerPayload.auth.workspaceId).toBe("user:audit-owner");
    expect(ownerPayload.ledger.workspaceId).toBe("account:audit-owner");
    expect(ownerPayload.ledger.runs[0].runId).toBe(runMetadata.runId);
  });

  it("deletes only the current authenticated user's audit history", async () => {
    await POST(new Request("http://toolars.test/api/ai/consent-audit", { body: JSON.stringify({ event, runMetadata }), method: "POST" }));
    const response = await DELETE(new Request("http://toolars.test/api/ai/consent-audit", { method: "DELETE" }));
    const payload = await response.json();
    expect(payload.deletion).toMatchObject({ deletedEvents: 1, deletedRuns: 1, scope: "ai-history" });
    expect((recordsByUser.get("audit-owner") ?? [])).toHaveLength(0);
  });

  it("retires the anonymous migration endpoint for authenticated users", async () => {
    expect((await PATCH(new Request("http://toolars.test/api/ai/consent-audit", { method: "PATCH" }))).status).toBe(410);
  });
});

function createAuditDriver(recordsByUser: Map<string, ToolarsPrivateAuditRecord[]>): ToolarsPrivateDataDriver {
  return {
    async createAuditRecord({ event: nextEvent, runMetadata: nextRunMetadata, userId }) {
      const record = { createdAt: new Date().toISOString(), event: nextEvent, runMetadata: nextRunMetadata };
      recordsByUser.set(userId, [...(recordsByUser.get(userId) ?? []), record]);
      return record;
    },
    async listAuditRecords({ userId }) { return recordsByUser.get(userId) ?? []; },
    async deleteAuditRecords({ userId }) {
      const deletedRecords = (recordsByUser.get(userId) ?? []).length;
      recordsByUser.set(userId, []);
      return { deletedRecords };
    },
    async createPdfUpload() { throw new Error("not used"); },
    async listPdfUploads() { return []; },
    async getPdfUpload() { return null; },
    async deletePdfUpload() { return false; }
  };
}

function setSupabaseUser(id: string) {
  setToolarsSupabaseServerAuthDriverForTest({
    getUser: vi.fn().mockResolvedValue({ data: { user: { email: `${id}@example.com`, id } }, error: null }),
    signOut: vi.fn()
  });
}
