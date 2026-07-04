import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  deletePdfUploadTempObject,
  listPdfUploadDeletionAudit,
  listPdfUploadHandoffs,
  registerPdfUploadTempObjects,
  resolvePdfUploadSignedObject,
  resolvePdfUploadSignedHandoff,
  resetPdfUploadTempStore,
  runPdfUploadScanWorker,
  setPdfUploadObjectStorageDriverForTest,
  setPdfUploadTempStorePathForTest,
  sweepExpiredPdfUploadTempObjects
} from "./pdf-upload-server-store";

describe("PDF upload server temp store", () => {
  let tempDirectory: string;

  beforeEach(() => {
    tempDirectory = mkdtempSync(join(tmpdir(), "toolars-pdf-upload-"));
    setPdfUploadTempStorePathForTest(join(tempDirectory, "uploads.json"));
    resetPdfUploadTempStore();
  });

  afterEach(() => {
    setPdfUploadObjectStorageDriverForTest(null);
    setPdfUploadTempStorePathForTest(null);
    rmSync(tempDirectory, { force: true, recursive: true });
  });

  it("stores scanned temporary PDF objects and exposes ready handoff records", () => {
    const records = registerPdfUploadTempObjects({
      files: [
        {
          contentHash: "sha256-board-pack",
          name: "Board Pack.pdf",
          size: 524_288,
          type: "application/pdf"
        }
      ],
      uploadedAt: "2026-06-19T10:22:00Z",
      workspaceId: "toolars_ws_upload_test"
    });

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      deleteStatus: "active",
      fileName: "Board Pack.pdf",
      handoffTarget: "pdf-summary",
      scanLabel: "Server scan passed",
      scanStatus: "ready",
      scanWorker: "pdf-upload-metadata-scan:v1",
      workspaceId: "toolars_ws_upload_test"
    });
    expect(records[0].objectKey).toMatch(/^temp\/toolars_ws_upload_test\/pdf_upload_/);
    expect(records[0].handoffToken).toMatch(/^handoff_pdf-summary_/);
    expect(records[0].signedHandoffUrl).toMatch(/^\/api\/pdf\/uploads\?handoffToken=handoff_pdf-summary_/);
    expect(records[0].signedObjectUrl).toMatch(/^\/api\/pdf\/uploads\/object\?objectKey=temp%2Ftoolars_ws_upload_test%2Fpdf_upload_/);
    expect(records[0].signedObjectUrl).toContain("signature=");

    const handoffs = listPdfUploadHandoffs({
      handoffTarget: "pdf-summary",
      workspaceId: "toolars_ws_upload_test"
    });

    expect(handoffs).toHaveLength(1);
    expect(handoffs[0].fileName).toBe("Board Pack.pdf");
  });

  it("resolves signed PDF handoff URLs and rejects tampered or expired handoffs", () => {
    const [record] = registerPdfUploadTempObjects({
      files: [
        {
          contentHash: "sha256-signed-board-pack",
          name: "Signed Board Pack.pdf",
          size: 524_288,
          type: "application/pdf"
        }
      ],
      uploadedAt: "2026-06-19T10:30:00Z",
      workspaceId: "toolars_ws_signed_handoff_test"
    });
    const signedUrl = new URL(record.signedHandoffUrl, "http://toolars.test");

    const resolved = resolvePdfUploadSignedHandoff({
      handoffToken: signedUrl.searchParams.get("handoffToken") ?? "",
      now: "2026-06-19T11:00:00Z",
      signature: signedUrl.searchParams.get("signature") ?? "",
      workspaceId: "toolars_ws_signed_handoff_test"
    });

    expect(resolved?.uploadId).toBe(record.uploadId);
    expect(resolved?.objectKey).toBe(record.objectKey);
    expect(resolved?.signedObjectUrl).toContain("objectKey=");
    expect(resolved?.signedObjectUrl).toContain("signature=");
    expect(
      resolvePdfUploadSignedHandoff({
        handoffToken: record.handoffToken,
        now: "2026-06-19T11:00:00Z",
        signature: "tampered",
        workspaceId: "toolars_ws_signed_handoff_test"
      })
    ).toBeNull();
    expect(
      resolvePdfUploadSignedHandoff({
        handoffToken: record.handoffToken,
        now: "2026-06-19T12:31:00Z",
        signature: signedUrl.searchParams.get("signature") ?? "",
        workspaceId: "toolars_ws_signed_handoff_test"
      })
    ).toBeNull();
  });

  it("reads signed temporary PDF object content and rejects invalid object URLs", () => {
    const content = "%PDF-1.7\nobject-store-content";
    const [record] = registerPdfUploadTempObjects({
      files: [
        {
          contentBase64: Buffer.from(content).toString("base64"),
          contentHash: "sha256-object-content",
          name: "Object Content.pdf",
          size: Buffer.byteLength(content),
          type: "application/pdf"
        }
      ],
      uploadedAt: "2026-06-19T10:40:00Z",
      workspaceId: "toolars_ws_object_content_test"
    });
    const signedObjectUrl = new URL(record.signedObjectUrl, "http://toolars.test");

    const resolved = resolvePdfUploadSignedObject({
      expiresAt: signedObjectUrl.searchParams.get("expiresAt") ?? "",
      now: "2026-06-19T11:00:00Z",
      objectKey: signedObjectUrl.searchParams.get("objectKey") ?? "",
      signature: signedObjectUrl.searchParams.get("signature") ?? "",
      workspaceId: "toolars_ws_object_content_test"
    });

    expect(resolved?.fileName).toBe("Object Content.pdf");
    expect(resolved?.contentType).toBe("application/pdf");
    expect(resolved?.content.toString("utf8")).toBe(content);
    expect(
      resolvePdfUploadSignedObject({
        expiresAt: signedObjectUrl.searchParams.get("expiresAt") ?? "",
        now: "2026-06-19T11:00:00Z",
        objectKey: record.objectKey,
        signature: "tampered",
        workspaceId: "toolars_ws_object_content_test"
      })
    ).toBeNull();
    expect(
      resolvePdfUploadSignedObject({
        expiresAt: signedObjectUrl.searchParams.get("expiresAt") ?? "",
        now: "2026-06-19T11:00:00Z",
        objectKey: record.objectKey,
        signature: signedObjectUrl.searchParams.get("signature") ?? "",
        workspaceId: "toolars_ws_wrong_object_test"
      })
    ).toBeNull();
  });

  it("treats blank PDF crypto env values as local fallbacks", () => {
    const originalObjectEncryptionKey = process.env.TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY;
    const originalUploadHandoffSecret = process.env.TOOLARS_UPLOAD_HANDOFF_SECRET;

    try {
      delete process.env.TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY;
      delete process.env.TOOLARS_UPLOAD_HANDOFF_SECRET;

      const content = "%PDF-1.7\nblank-env-fallback";
      const [record] = registerPdfUploadTempObjects({
        files: [
          {
            contentBase64: Buffer.from(content).toString("base64"),
            contentHash: "sha256-blank-env-fallback",
            name: "Blank Env Fallback.pdf",
            size: Buffer.byteLength(content),
            type: "application/pdf"
          }
        ],
        uploadedAt: "2026-06-29T14:50:00Z",
        workspaceId: "toolars_ws_blank_env_fallback_test"
      });
      const signedObjectUrl = new URL(record.signedObjectUrl, "http://toolars.test");

      process.env.TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY = "   ";
      process.env.TOOLARS_UPLOAD_HANDOFF_SECRET = "   ";

      const resolved = resolvePdfUploadSignedObject({
        expiresAt: signedObjectUrl.searchParams.get("expiresAt") ?? "",
        now: "2026-06-29T15:00:00Z",
        objectKey: record.objectKey,
        signature: signedObjectUrl.searchParams.get("signature") ?? "",
        workspaceId: "toolars_ws_blank_env_fallback_test"
      });

      expect(resolved?.content.toString("utf8")).toBe(content);
    } finally {
      restoreEnvValue("TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY", originalObjectEncryptionKey);
      restoreEnvValue("TOOLARS_UPLOAD_HANDOFF_SECRET", originalUploadHandoffSecret);
    }
  });

  it("removes temporary PDF content after user-requested deletion", () => {
    const content = "%PDF-1.7\ncleanup-after-delete";
    const originalFile = {
      contentBase64: Buffer.from(content).toString("base64"),
      contentHash: "sha256-delete-cleanup",
      name: "Delete Cleanup.pdf",
      size: Buffer.byteLength(content),
      type: "application/pdf"
    };
    const [record] = registerPdfUploadTempObjects({
      files: [originalFile],
      uploadedAt: "2026-06-19T10:50:00Z",
      workspaceId: "toolars_ws_delete_cleanup_test"
    });
    const signedObjectUrl = new URL(record.signedObjectUrl, "http://toolars.test");

    expect(
      resolvePdfUploadSignedObject({
        expiresAt: signedObjectUrl.searchParams.get("expiresAt") ?? "",
        now: "2026-06-19T11:00:00Z",
        objectKey: record.objectKey,
        signature: signedObjectUrl.searchParams.get("signature") ?? "",
        workspaceId: "toolars_ws_delete_cleanup_test"
      })?.content.toString("utf8")
    ).toBe(content);

    deletePdfUploadTempObject({
      deletedAt: "2026-06-19T11:01:00Z",
      uploadId: record.uploadId,
      workspaceId: "toolars_ws_delete_cleanup_test"
    });

    const [metadataOnlyRecord] = registerPdfUploadTempObjects({
      files: [
        {
          contentHash: originalFile.contentHash,
          name: originalFile.name,
          size: originalFile.size,
          type: originalFile.type
        }
      ],
      uploadedAt: "2026-06-19T10:50:00Z",
      workspaceId: "toolars_ws_delete_cleanup_test"
    });
    const metadataOnlyUrl = new URL(metadataOnlyRecord.signedObjectUrl, "http://toolars.test");

    expect(metadataOnlyRecord.objectKey).toBe(record.objectKey);
    expect(
      resolvePdfUploadSignedObject({
        expiresAt: metadataOnlyUrl.searchParams.get("expiresAt") ?? "",
        now: "2026-06-19T11:02:00Z",
        objectKey: metadataOnlyRecord.objectKey,
        signature: metadataOnlyUrl.searchParams.get("signature") ?? "",
        workspaceId: "toolars_ws_delete_cleanup_test"
      })
    ).toBeNull();
  });

  it("removes temporary PDF content during expired retention sweeps", () => {
    const content = "%PDF-1.7\ncleanup-after-sweep";
    const originalFile = {
      contentBase64: Buffer.from(content).toString("base64"),
      contentHash: "sha256-sweep-cleanup",
      name: "Sweep Cleanup.pdf",
      size: Buffer.byteLength(content),
      type: "application/pdf"
    };
    const [record] = registerPdfUploadTempObjects({
      files: [originalFile],
      uploadedAt: "2026-06-19T10:00:00Z",
      workspaceId: "toolars_ws_sweep_cleanup_test"
    });

    sweepExpiredPdfUploadTempObjects({
      deletedAt: "2026-06-19T12:31:00Z",
      now: "2026-06-19T12:31:00Z",
      workspaceId: "toolars_ws_sweep_cleanup_test"
    });

    const [metadataOnlyRecord] = registerPdfUploadTempObjects({
      files: [
        {
          contentHash: originalFile.contentHash,
          name: originalFile.name,
          size: originalFile.size,
          type: originalFile.type
        }
      ],
      uploadedAt: "2026-06-19T10:00:00Z",
      workspaceId: "toolars_ws_sweep_cleanup_test"
    });
    const metadataOnlyUrl = new URL(metadataOnlyRecord.signedObjectUrl, "http://toolars.test");

    expect(metadataOnlyRecord.objectKey).toBe(record.objectKey);
    expect(
      resolvePdfUploadSignedObject({
        expiresAt: metadataOnlyUrl.searchParams.get("expiresAt") ?? "",
        now: "2026-06-19T11:00:00Z",
        objectKey: metadataOnlyRecord.objectKey,
        signature: metadataOnlyUrl.searchParams.get("signature") ?? "",
        workspaceId: "toolars_ws_sweep_cleanup_test"
      })
    ).toBeNull();
  });

  it("marks temp objects as deleted while preserving the deletion audit state", () => {
    const [record] = registerPdfUploadTempObjects({
      files: [
        {
          contentHash: "sha256-contract",
          name: "Contract.pdf",
          size: 350_000,
          type: "application/pdf"
        }
      ],
      uploadedAt: "2026-06-19T10:24:00Z",
      workspaceId: "toolars_ws_upload_delete_test"
    });

    const deletion = deletePdfUploadTempObject({
      deletedAt: "2026-06-19T10:25:00Z",
      uploadId: record.uploadId,
      workspaceId: "toolars_ws_upload_delete_test"
    });

    expect(deletion).toMatchObject({
      deleteStatus: "deleted",
      deletedAt: "2026-06-19T10:25:00Z",
      fileName: "Contract.pdf",
      uploadId: record.uploadId
    });
    expect(
      listPdfUploadHandoffs({
        handoffTarget: "pdf-summary",
        workspaceId: "toolars_ws_upload_delete_test"
      })
    ).toHaveLength(0);
    expect(listPdfUploadDeletionAudit({ workspaceId: "toolars_ws_upload_delete_test" })).toEqual([
      expect.objectContaining({
        deleteReason: "user-requested",
        deleteStatus: "deleted",
        fileName: "Contract.pdf",
        uploadId: record.uploadId
      })
    ]);
  });

  it("sweeps expired temp objects and keeps a retention deletion audit", () => {
    const [expiredRecord] = registerPdfUploadTempObjects({
      files: [
        {
          contentHash: "sha256-expired",
          name: "Expired.pdf",
          size: 350_000,
          type: "application/pdf"
        }
      ],
      uploadedAt: "2026-06-19T10:00:00Z",
      workspaceId: "toolars_ws_retention_test"
    });
    registerPdfUploadTempObjects({
      files: [
        {
          contentHash: "sha256-active",
          name: "Still Active.pdf",
          size: 350_000,
          type: "application/pdf"
        }
      ],
      uploadedAt: "2026-06-19T11:30:00Z",
      workspaceId: "toolars_ws_retention_test"
    });

    const sweep = sweepExpiredPdfUploadTempObjects({
      deletedAt: "2026-06-19T12:31:00Z",
      now: "2026-06-19T12:31:00Z",
      workspaceId: "toolars_ws_retention_test"
    });

    expect(sweep.deletions).toEqual([
      expect.objectContaining({
        deleteReason: "expired",
        deleteStatus: "deleted",
        fileName: "Expired.pdf",
        uploadId: expiredRecord.uploadId
      })
    ]);
    expect(
      listPdfUploadHandoffs({
        handoffTarget: "pdf-summary",
        workspaceId: "toolars_ws_retention_test"
      }).map((upload) => upload.fileName)
    ).toEqual(["Still Active.pdf"]);
    expect(listPdfUploadDeletionAudit({ workspaceId: "toolars_ws_retention_test" })).toEqual([
      expect.objectContaining({
        deleteReason: "expired",
        fileName: "Expired.pdf"
      })
    ]);
  });

  it("can store signed temporary PDF bytes through an injected object storage driver", () => {
    const objects = new Map<string, Buffer>();
    setPdfUploadObjectStorageDriverForTest({
      delete: (objectKey) => {
        objects.delete(objectKey);
      },
      read: (objectKey) => objects.get(objectKey) ?? null,
      reset: () => {
        objects.clear();
      },
      write: (objectKey, content) => {
        objects.set(objectKey, Buffer.from(content));
      }
    });
    resetPdfUploadTempStore();

    const content = "%PDF-1.7\nbucket-backed-content";
    const [record] = registerPdfUploadTempObjects({
      files: [
        {
          contentBase64: Buffer.from(content).toString("base64"),
          contentHash: "sha256-bucket-backed-content",
          name: "Bucket Backed.pdf",
          size: Buffer.byteLength(content),
          type: "application/pdf"
        }
      ],
      uploadedAt: "2026-06-19T11:20:00Z",
      workspaceId: "toolars_ws_object_storage_driver_test"
    });

    const signedObjectUrl = new URL(record.signedObjectUrl, "http://toolars.test");
    const resolved = resolvePdfUploadSignedObject({
      expiresAt: signedObjectUrl.searchParams.get("expiresAt") ?? "",
      now: "2026-06-19T11:40:00Z",
      objectKey: record.objectKey,
      signature: signedObjectUrl.searchParams.get("signature") ?? "",
      workspaceId: "toolars_ws_object_storage_driver_test"
    });

    expect(objects.get(record.objectKey)?.toString("utf8")).not.toBe(content);
    expect(objects.get(record.objectKey)?.toString("utf8")).toMatch(/^toolars\.enc\.v1\./);
    expect(resolved?.content.toString("utf8")).toBe(content);
    expect(existsSync(join(tempDirectory, "toolars-pdf-upload-objects"))).toBe(false);
  });

  it("uses production runtime paths for PDF metadata and encrypted object bytes", () => {
    const originalTempStorePath = process.env.TOOLARS_PDF_UPLOAD_TEMP_STORE_PATH;
    const originalObjectRoot = process.env.TOOLARS_PDF_UPLOAD_OBJECT_ROOT;
    const runtimeStorePath = join(tempDirectory, "runtime", "pdf-uploads.json");
    const runtimeObjectRoot = join(tempDirectory, "runtime-objects");
    setPdfUploadTempStorePathForTest(null);
    setPdfUploadObjectStorageDriverForTest(null);
    process.env.TOOLARS_PDF_UPLOAD_TEMP_STORE_PATH = runtimeStorePath;
    process.env.TOOLARS_PDF_UPLOAD_OBJECT_ROOT = runtimeObjectRoot;

    try {
      resetPdfUploadTempStore();
      const content = "%PDF-1.7\nruntime-object-root";
      const [record] = registerPdfUploadTempObjects({
        files: [
          {
            contentBase64: Buffer.from(content).toString("base64"),
            contentHash: "sha256-runtime-object-root",
            name: "Runtime Object Root.pdf",
            size: Buffer.byteLength(content),
            type: "application/pdf"
          }
        ],
        uploadedAt: "2026-06-21T12:10:00Z",
        workspaceId: "toolars_ws_runtime_object_test"
      });
      const objectPath = join(runtimeObjectRoot, ...record.objectKey.split("/"));

      expect(existsSync(runtimeStorePath)).toBe(true);
      expect(existsSync(objectPath)).toBe(true);

      const signedObjectUrl = new URL(record.signedObjectUrl, "http://toolars.test");
      const resolved = resolvePdfUploadSignedObject({
        expiresAt: signedObjectUrl.searchParams.get("expiresAt") ?? "",
        now: "2026-06-21T12:20:00Z",
        objectKey: record.objectKey,
        signature: signedObjectUrl.searchParams.get("signature") ?? "",
        workspaceId: "toolars_ws_runtime_object_test"
      });

      expect(resolved?.content.toString("utf8")).toBe(content);
    } finally {
      process.env.TOOLARS_PDF_UPLOAD_TEMP_STORE_PATH = originalTempStorePath;
      process.env.TOOLARS_PDF_UPLOAD_OBJECT_ROOT = originalObjectRoot;
    }
  });

  it("queues uploads for an async scan worker before exposing handoffs", () => {
    const content = "%PDF-1.7\nqueued-worker-content";
    const [queued] = registerPdfUploadTempObjects({
      files: [
        {
          contentBase64: Buffer.from(content).toString("base64"),
          contentHash: "sha256-queued-worker-content",
          name: "Queued Worker.pdf",
          size: Buffer.byteLength(content),
          type: "application/pdf"
        }
      ],
      scanMode: "queued",
      uploadedAt: "2026-06-21T10:00:00Z",
      workspaceId: "toolars_ws_scan_worker_test"
    });

    expect(queued).toMatchObject({
      scanLabel: "Queued for server scan",
      scanStatus: "queued"
    });
    expect(
      listPdfUploadHandoffs({
        handoffTarget: "pdf-summary",
        workspaceId: "toolars_ws_scan_worker_test"
      })
    ).toHaveLength(0);

    const scan = runPdfUploadScanWorker({
      scannedAt: "2026-06-21T10:01:00Z",
      workspaceId: "toolars_ws_scan_worker_test"
    });
    const handoffs = listPdfUploadHandoffs({
      handoffTarget: "pdf-summary",
      workspaceId: "toolars_ws_scan_worker_test"
    });
    const signedObjectUrl = new URL(handoffs[0].signedObjectUrl, "http://toolars.test");
    const resolved = resolvePdfUploadSignedObject({
      expiresAt: signedObjectUrl.searchParams.get("expiresAt") ?? "",
      now: "2026-06-21T10:02:00Z",
      objectKey: handoffs[0].objectKey,
      signature: signedObjectUrl.searchParams.get("signature") ?? "",
      workspaceId: "toolars_ws_scan_worker_test"
    });

    expect(scan.processed).toEqual([
      expect.objectContaining({
        fileName: "Queued Worker.pdf",
        scanLabel: "Server scan passed",
        scanStatus: "ready",
        uploadId: queued.uploadId
      })
    ]);
    expect(handoffs).toHaveLength(1);
    expect(resolved?.content.toString("utf8")).toBe(content);
  });
});

function restoreEnvValue(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}
