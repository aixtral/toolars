import { describe, expect, it } from "vitest";
import { planOcrScan } from "./ocr-scanner";

describe("planOcrScan", () => {
  it("plans OCR handoff for supported image files without uploading content", () => {
    const result = planOcrScan({
      file: { name: "receipt.png", sizeBytes: 520_000, type: "image/png" },
      language: "en",
      outputFormat: "txt"
    });

    expect(result.status).toBe("ready-for-ocr");
    expect(result.inputKind).toBe("image");
    if (!result.output) throw new Error("Expected OCR handoff output");
    expect(result.output.fileName).toBe("receipt_ocr.txt");
    expect(result.output.estimatedPages).toBe(1);
    expect(result.trustBoundary.requiresBackend).toBe(true);
  });

  it("blocks unsupported file types before OCR planning", () => {
    const result = planOcrScan({
      file: { name: "archive.zip", sizeBytes: 900_000, type: "application/zip" },
      language: "en",
      outputFormat: "json"
    });

    expect(result.status).toBe("blocked");
    expect(result.validationIssues).toEqual(["Choose a PDF, PNG, JPG, or TIFF file before planning OCR."]);
  });
});
