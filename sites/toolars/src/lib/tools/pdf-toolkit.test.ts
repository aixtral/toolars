import { describe, expect, it } from "vitest";
import { buildPdfJob, getPdfOperationPolicy, samplePdfFiles } from "./pdf-toolkit";

describe("PDF Toolkit job planning", () => {
  it("keeps merge operations local and produces a merged output", () => {
    const result = buildPdfJob({
      files: samplePdfFiles.slice(0, 2),
      operation: "merge",
      consentGranted: false
    });

    expect(result.status).toBe("completed");
    expect(result.consentRequired).toBe(false);
    expect(result.securityLabel).toBe("Processed locally");
    expect(result.output?.fileName).toBe("Q2_Marketing_Report_2024_merged.pdf");
    expect(result.output?.pages).toBe(42);
  });

  it("blocks AI summary work until consent is granted", () => {
    const blocked = buildPdfJob({
      files: samplePdfFiles,
      operation: "summarize",
      consentGranted: false
    });

    expect(blocked.status).toBe("needs-consent");
    expect(blocked.consentRequired).toBe(true);
    expect(blocked.output).toBeUndefined();

    const completed = buildPdfJob({
      files: samplePdfFiles,
      operation: "summarize",
      consentGranted: true
    });

    expect(completed.status).toBe("completed");
    expect(completed.output?.summary).toContain("Q2 2024 marketing report");
    expect(completed.securityLabel).toBe("AI consent granted");
  });

  it("requires at least one PDF before planning an operation", () => {
    const result = buildPdfJob({
      files: [],
      operation: "compress",
      consentGranted: false
    });

    expect(result.status).toBe("blocked");
    expect(result.message).toBe("Add at least one PDF file to continue.");
  });

  it("exposes processing policy for the workspace tabs", () => {
    expect(getPdfOperationPolicy("merge")).toMatchObject({
      label: "Merge",
      consentRequired: false,
      processing: "local"
    });
    expect(getPdfOperationPolicy("summarize")).toMatchObject({
      label: "Summarize",
      consentRequired: true,
      processing: "ai-consent"
    });
  });
});
