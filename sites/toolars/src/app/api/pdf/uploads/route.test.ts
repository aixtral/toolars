import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ToolarsPrivateDataDriver, ToolarsPrivatePdfUpload } from "@/lib/supabase/toolars-private-data";
import { setToolarsPrivateDataDriverForTest } from "@/lib/supabase/toolars-private-data";
import { setToolarsSupabaseServerAuthDriverForTest } from "@/lib/supabase/toolars-supabase-auth-server";
import { DELETE, GET, POST } from "./route";
import { GET as GET_OBJECT } from "./object/route";
import { POST as POST_SCAN } from "./scan/route";

describe("/api/pdf/uploads", () => {
  let uploadsByUser: Map<string, ToolarsPrivatePdfUpload[]>;

  beforeEach(() => {
    uploadsByUser = new Map();
    setToolarsPrivateDataDriverForTest(createPdfDriver(uploadsByUser));
    setSupabaseUser("pdf-owner");
  });

  afterEach(() => {
    setToolarsPrivateDataDriverForTest(null);
    setToolarsSupabaseServerAuthDriverForTest(null);
  });

  it("rejects anonymous PDF writes despite a forged workspace header", async () => {
    setToolarsSupabaseServerAuthDriverForTest(null);
    const response = await POST(uploadRequest("private.pdf", { "x-toolars-workspace-id": "victim-workspace" }));
    expect(response.status).toBe(401);
    expect(uploadsByUser.size).toBe(0);
  });

  it("creates a private Supabase-backed handoff for the authenticated user", async () => {
    const response = await POST(uploadRequest("Board Pack.pdf", { "x-toolars-workspace-id": "untrusted-workspace" }));
    const payload = await response.json();
    expect(response.status).toBe(201);
    expect(payload.uploads[0]).toMatchObject({
      fileName: "blob",
      retentionLabel: "Private temporary storage",
      scanLabel: "PDF type and size validated",
      scanStatus: "ready"
    });
    expect(payload.uploads[0].signedObjectUrl).toContain("https://storage.test/");
    expect((uploadsByUser.get("pdf-owner") ?? [])).toHaveLength(1);
  });

  it("does not expose another user's upload when the client replays its id or workspace header", async () => {
    const created = await (await POST(uploadRequest("Owner.pdf"))).json();
    const uploadId = created.uploads[0].uploadId as string;

    setSupabaseUser("other-user");
    const listResponse = await GET(new Request("http://toolars.test/api/pdf/uploads?handoffToken=" + uploadId, { headers: { "x-toolars-workspace-id": "pdf-owner" } }));
    const objectResponse = await GET_OBJECT(new Request("http://toolars.test/api/pdf/uploads/object?uploadId=" + uploadId, { headers: { "x-toolars-workspace-id": "pdf-owner" } }));
    const deleteResponse = await DELETE(new Request("http://toolars.test/api/pdf/uploads", { body: JSON.stringify({ uploadId }), method: "DELETE" }));

    expect(listResponse.status).toBe(404);
    expect(objectResponse.status).toBe(404);
    expect(deleteResponse.status).toBe(404);
    expect((uploadsByUser.get("pdf-owner") ?? [])).toHaveLength(1);
  });

  it("redirects the owner to a short-lived storage URL and protects the scan endpoint", async () => {
    const created = await (await POST(uploadRequest("Owner.pdf"))).json();
    const uploadId = created.uploads[0].uploadId as string;
    const objectResponse = await GET_OBJECT(new Request("http://toolars.test/api/pdf/uploads/object?uploadId=" + uploadId));
    expect(objectResponse.status).toBe(302);
    expect(objectResponse.headers.get("location")).toContain("https://storage.test/");

    setToolarsSupabaseServerAuthDriverForTest(null);
    expect((await POST_SCAN(new Request("http://toolars.test/api/pdf/uploads/scan", { method: "POST" }))).status).toBe(401);
  });
});

function uploadRequest(fileName: string, headers?: HeadersInit) {
  const formData = new FormData();
  formData.append("files", new File(["%PDF-1.7"], fileName, { type: "application/pdf" }), fileName);
  return new Request("http://toolars.test/api/pdf/uploads", { body: formData, headers, method: "POST" });
}

function createPdfDriver(uploadsByUser: Map<string, ToolarsPrivatePdfUpload[]>): ToolarsPrivateDataDriver {
  return {
    async createPdfUpload({ expiresAt, fileName, fileSizeBytes, userId }) {
      const id = `upload-${(uploadsByUser.get(userId) ?? []).length + 1}`;
      const record = {
        createdAt: new Date().toISOString(),
        expiresAt,
        fileName,
        fileSizeBytes,
        id,
        objectPath: `${userId}/${id}.pdf`,
        signedObjectUrl: `https://storage.test/${userId}/${id}.pdf?token=short-lived`
      };
      uploadsByUser.set(userId, [...(uploadsByUser.get(userId) ?? []), record]);
      return record;
    },
    async listPdfUploads({ userId }) { return uploadsByUser.get(userId) ?? []; },
    async getPdfUpload({ id, userId }) { return (uploadsByUser.get(userId) ?? []).find((upload) => upload.id === id) ?? null; },
    async deletePdfUpload({ id, userId }) {
      const current = uploadsByUser.get(userId) ?? [];
      if (!current.some((upload) => upload.id === id)) return false;
      uploadsByUser.set(userId, current.filter((upload) => upload.id !== id));
      return true;
    },
    async createAuditRecord() { throw new Error("not used"); },
    async listAuditRecords() { return []; },
    async deleteAuditRecords() { return { deletedRecords: 0 }; }
  };
}

function setSupabaseUser(id: string) {
  setToolarsSupabaseServerAuthDriverForTest({
    getUser: vi.fn().mockResolvedValue({ data: { user: { email: `${id}@example.com`, id } }, error: null }),
    signOut: vi.fn()
  });
}
