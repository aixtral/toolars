import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { registerPdfUploadTempObjects, resetPdfUploadTempStore, setPdfUploadTempStorePathForTest } from "@/lib/tools/pdf-upload-server-store";
import { DELETE, GET, POST } from "./route";
import { GET as GET_OBJECT } from "./object/route";
import { POST as POST_SCAN } from "./scan/route";

/**
 * Anchor upload timestamps to the current time so signed-object URLs never
 * go stale between the time the fixture is written and the test asserts.
 */
function recentTimestamp() {
  return new Date().toISOString();
}

describe("/api/pdf/uploads", () => {
  let tempDirectory: string;

  beforeEach(() => {
    tempDirectory = mkdtempSync(join(tmpdir(), "toolars-api-pdf-upload-"));
    setPdfUploadTempStorePathForTest(join(tempDirectory, "uploads.json"));
    resetPdfUploadTempStore();
  });

  afterEach(() => {
    setPdfUploadTempStorePathForTest(null);
    rmSync(tempDirectory, { force: true, recursive: true });
  });

  it("registers File API uploads as scanned temporary handoff objects", async () => {
    const formData = new FormData();
    const upload = new File(["%PDF-1.7"], "Board Pack.pdf", { type: "application/pdf" });
    formData.append("files", upload, upload.name);
    formData.append("fileNames", upload.name);

    const response = await POST(
      new Request("http://toolars.test/api/pdf/uploads", {
        body: formData,
        headers: {
          "x-toolars-workspace-id": "toolars_ws_api_upload_test"
        },
        method: "POST"
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.uploads[0]).toMatchObject({
      deleteStatus: "active",
      fileName: "Board Pack.pdf",
      handoffTarget: "pdf-summary",
      scanLabel: "Server scan passed",
      scanStatus: "ready",
      workspaceId: "toolars_ws_api_upload_test"
    });

    const handoffResponse = await GET(
      new Request("http://toolars.test/api/pdf/uploads?handoff=pdf-summary", {
        headers: {
          "x-toolars-workspace-id": "toolars_ws_api_upload_test"
        }
      })
    );
    const handoffPayload = await handoffResponse.json();

    expect(handoffPayload.uploads).toHaveLength(1);
    expect(handoffPayload.uploads[0].handoffToken).toMatch(/^handoff_pdf-summary_/);
    expect(handoffPayload.uploads[0].signedHandoffUrl).toContain("signature=");

    const signedHandoffResponse = await GET(
      new Request(`http://toolars.test${handoffPayload.uploads[0].signedHandoffUrl}`, {
        headers: {
          "x-toolars-workspace-id": "toolars_ws_api_upload_test"
        }
      })
    );
    const signedHandoffPayload = await signedHandoffResponse.json();

    expect(signedHandoffResponse.status).toBe(200);
    expect(signedHandoffPayload.upload).toMatchObject({
      fileName: "Board Pack.pdf",
      handoffToken: handoffPayload.uploads[0].handoffToken,
      scanStatus: "ready"
    });
    expect(signedHandoffPayload.upload.signedObjectUrl).toContain("/api/pdf/uploads/object?");
    expect(signedHandoffPayload.upload.signedObjectUrl).toContain("signature=");
  });

  it("marks a temporary upload deleted by workspace and upload id", async () => {
    const formData = new FormData();
    const upload = new File(["%PDF-1.7"], "Delete Me.pdf", { type: "application/pdf" });
    formData.append("files", upload, upload.name);
    formData.append("fileNames", upload.name);

    const created = await (
      await POST(
        new Request("http://toolars.test/api/pdf/uploads", {
          body: formData,
          headers: {
            "x-toolars-workspace-id": "toolars_ws_api_delete_test"
          },
          method: "POST"
        })
      )
    ).json();

    const response = await DELETE(
      new Request("http://toolars.test/api/pdf/uploads", {
        body: JSON.stringify({ uploadId: created.uploads[0].uploadId }),
        headers: {
          "Content-Type": "application/json",
          "x-toolars-workspace-id": "toolars_ws_api_delete_test"
        },
        method: "DELETE"
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.deletion).toMatchObject({
      deleteStatus: "deleted",
      fileName: "Delete Me.pdf",
      uploadId: created.uploads[0].uploadId
    });

    const handoffs = await (
      await GET(
        new Request("http://toolars.test/api/pdf/uploads?handoff=pdf-summary", {
          headers: {
            "x-toolars-workspace-id": "toolars_ws_api_delete_test"
          }
        })
      )
    ).json();

    expect(handoffs.uploads).toHaveLength(0);
  });

  it("serves signed temporary PDF object content and rejects tampered object URLs", async () => {
    const content = "%PDF-1.7\nroute-object-content";
    const [record] = registerPdfUploadTempObjects({
      files: [
        {
          contentBase64: Buffer.from(content).toString("base64"),
          contentHash: "sha256-route-object-content",
          name: "Route Object.pdf",
          size: Buffer.byteLength(content),
          type: "application/pdf"
        }
      ],
      uploadedAt: recentTimestamp(),
      workspaceId: "toolars_ws_api_object_test"
    });

    const objectResponse = await GET_OBJECT(
      new Request(`http://toolars.test${record.signedObjectUrl}`, {
        headers: {
          "x-toolars-workspace-id": "toolars_ws_api_object_test"
        }
      })
    );

    expect(objectResponse.status).toBe(200);
    expect(objectResponse.headers.get("content-type")).toBe("application/pdf");
    expect(objectResponse.headers.get("cache-control")).toBe("no-store");
    expect(await objectResponse.text()).toBe(content);

    const tampered = await GET_OBJECT(
      new Request(`http://toolars.test${record.signedObjectUrl.replace("signature=", "signature=tampered")}`, {
        headers: {
          "x-toolars-workspace-id": "toolars_ws_api_object_test"
        }
      })
    );

    expect(tampered.status).toBe(403);
  });

  it("records object access audit entries for granted and rejected object reads", async () => {
    const content = "%PDF-1.7\nroute-object-audit";
    const [record] = registerPdfUploadTempObjects({
      files: [
        {
          contentBase64: Buffer.from(content).toString("base64"),
          contentHash: "sha256-route-object-audit",
          name: "Route Object Audit.pdf",
          size: Buffer.byteLength(content),
          type: "application/pdf"
        }
      ],
      uploadedAt: recentTimestamp(),
      workspaceId: "toolars_ws_api_object_audit_test"
    });

    await GET_OBJECT(
      new Request(`http://toolars.test${record.signedObjectUrl}`, {
        headers: {
          "x-toolars-workspace-id": "toolars_ws_api_object_audit_test"
        }
      })
    );
    await GET_OBJECT(
      new Request(`http://toolars.test${record.signedObjectUrl.replace("signature=", "signature=tampered")}`, {
        headers: {
          "x-toolars-workspace-id": "toolars_ws_api_object_audit_test"
        }
      })
    );

    const ledger = await (
      await GET(
        new Request("http://toolars.test/api/pdf/uploads?handoff=pdf-summary", {
          headers: {
            "x-toolars-workspace-id": "toolars_ws_api_object_audit_test"
          }
        })
      )
    ).json();

    expect(ledger.objectAccesses).toEqual([
      expect.objectContaining({
        accessStatus: "granted",
        fileName: "Route Object Audit.pdf",
        objectKey: record.objectKey,
        uploadId: record.uploadId,
        workspaceId: "toolars_ws_api_object_audit_test"
      }),
      expect.objectContaining({
        accessStatus: "rejected",
        denyReason: "invalid-or-expired-object-access",
        objectKey: record.objectKey,
        workspaceId: "toolars_ws_api_object_audit_test"
      })
    ]);
    expect(ledger.objectAccesses[0].accessedAt).toEqual(expect.any(String));
    expect(ledger.objectAccesses[1].accessedAt).toEqual(expect.any(String));
  });

  it("rejects tampered signed handoffs and sweeps expired temp objects", async () => {
    const [expiredRecord] = registerPdfUploadTempObjects({
      files: [
        {
          contentHash: "sha256-route-expired",
          name: "Route Expired.pdf",
          size: 350_000,
          type: "application/pdf"
        }
      ],
      uploadedAt: "2026-06-19T10:00:00Z",
      workspaceId: "toolars_ws_api_retention_test"
    });
    registerPdfUploadTempObjects({
      files: [
        {
          contentHash: "sha256-route-active",
          name: "Route Active.pdf",
          size: 350_000,
          type: "application/pdf"
        }
      ],
      uploadedAt: "2026-06-19T11:45:00Z",
      workspaceId: "toolars_ws_api_retention_test"
    });

    const tampered = await GET(
      new Request(`http://toolars.test/api/pdf/uploads?handoffToken=${expiredRecord.handoffToken}&signature=tampered`, {
        headers: {
          "x-toolars-workspace-id": "toolars_ws_api_retention_test"
        }
      })
    );

    expect(tampered.status).toBe(403);

    const sweep = await DELETE(
      new Request("http://toolars.test/api/pdf/uploads?sweep=expired&now=2026-06-19T12:31:00Z", {
        headers: {
          "x-toolars-workspace-id": "toolars_ws_api_retention_test"
        },
        method: "DELETE"
      })
    );
    const sweepPayload = await sweep.json();

    expect(sweep.status).toBe(200);
    expect(sweepPayload.deletions).toEqual([
      expect.objectContaining({
        deleteReason: "expired",
        fileName: "Route Expired.pdf",
        uploadId: expiredRecord.uploadId
      })
    ]);

    const handoffs = (await (
      await GET(
        new Request("http://toolars.test/api/pdf/uploads?handoff=pdf-summary", {
          headers: {
            "x-toolars-workspace-id": "toolars_ws_api_retention_test"
          }
        })
      )
    ).json()) as { deletions: Array<{ deleteReason: string; fileName: string }>; uploads: Array<{ fileName: string }> };

    expect(handoffs.uploads.map((upload) => upload.fileName)).toEqual(["Route Active.pdf"]);
    expect(handoffs.deletions).toEqual([
      expect.objectContaining({
        deleteReason: "expired",
        fileName: "Route Expired.pdf"
      })
    ]);
  });

  it("queues File API uploads for the async scan worker before exposing handoffs", async () => {
    const formData = new FormData();
    const upload = new File(["%PDF-1.7\nasync-route"], "Async Route.pdf", { type: "application/pdf" });
    formData.append("files", upload, upload.name);
    formData.append("fileNames", upload.name);

    const queuedResponse = await POST(
      new Request("http://toolars.test/api/pdf/uploads?scan=async", {
        body: formData,
        headers: {
          "x-toolars-workspace-id": "toolars_ws_api_scan_worker_test"
        },
        method: "POST"
      })
    );
    const queuedPayload = await queuedResponse.json();

    expect(queuedResponse.status).toBe(201);
    expect(queuedPayload.uploads[0]).toMatchObject({
      fileName: "Async Route.pdf",
      scanLabel: "Queued for server scan",
      scanStatus: "queued"
    });

    const emptyHandoffs = await (
      await GET(
        new Request("http://toolars.test/api/pdf/uploads?handoff=pdf-summary", {
          headers: {
            "x-toolars-workspace-id": "toolars_ws_api_scan_worker_test"
          }
        })
      )
    ).json();

    expect(emptyHandoffs.uploads).toHaveLength(0);

    const scanResponse = await POST_SCAN(
      new Request("http://toolars.test/api/pdf/uploads/scan", {
        headers: {
          "x-toolars-workspace-id": "toolars_ws_api_scan_worker_test"
        },
        method: "POST"
      })
    );
    const scanPayload = await scanResponse.json();

    expect(scanResponse.status).toBe(200);
    expect(scanPayload.processed).toEqual([
      expect.objectContaining({
        fileName: "Async Route.pdf",
        scanLabel: "Server scan passed",
        scanStatus: "ready"
      })
    ]);

    const readyHandoffs = await (
      await GET(
        new Request("http://toolars.test/api/pdf/uploads?handoff=pdf-summary", {
          headers: {
            "x-toolars-workspace-id": "toolars_ws_api_scan_worker_test"
          }
        })
      )
    ).json();

    expect(readyHandoffs.uploads).toHaveLength(1);
    expect(readyHandoffs.uploads[0].signedObjectUrl).toContain("signature=");
  });
});
