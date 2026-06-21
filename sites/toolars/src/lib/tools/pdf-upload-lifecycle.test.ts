import { describe, expect, it } from "vitest";
import { buildPdfUploadItems, PDF_UPLOAD_LIMIT_BYTES } from "./pdf-upload-lifecycle";

describe("PDF upload lifecycle", () => {
  it("maps File API objects into scanned local upload items with retention metadata", () => {
    const items = buildPdfUploadItems([
      {
        lastModified: 1781827200000,
        name: "Client_Brief.pdf",
        size: 524_288,
        type: "application/pdf"
      }
    ]);

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      deleteStatus: "active",
      id: "upload-client-brief-pdf-524288",
      name: "Client_Brief.pdf",
      retentionLabel: "Auto-delete after session",
      scanLabel: "Scan passed",
      scanStatus: "scan-passed",
      source: "local"
    });
    expect(items[0]?.sizeMb).toBe(0.5);
  });

  it("rejects oversized or non-PDF files before they can enter the workspace queue", () => {
    const items = buildPdfUploadItems([
      {
        name: "Too_Large.pdf",
        size: PDF_UPLOAD_LIMIT_BYTES + 1,
        type: "application/pdf"
      },
      {
        name: "notes.txt",
        size: 1200,
        type: "text/plain"
      }
    ]);

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      retentionLabel: "Not retained",
      scanLabel: "Blocked by 50 MB PDF limit",
      scanStatus: "rejected"
    });
    expect(items[1]).toMatchObject({
      retentionLabel: "Not retained",
      scanLabel: "Only PDF files can be queued",
      scanStatus: "rejected"
    });
  });
});
