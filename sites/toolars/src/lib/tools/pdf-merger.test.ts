import { describe, expect, it } from "vitest";
import { planPdfMerge } from "./pdf-merger";

describe("planPdfMerge", () => {
  it("builds a local merge plan from ordered PDF metadata", () => {
    const result = planPdfMerge({
      files: [
        { name: "Client Brief.pdf", pages: 8, sizeBytes: 1_600_000, type: "application/pdf" },
        { name: "Appendix.pdf", pages: 4, sizeBytes: 800_000, type: "application/pdf" }
      ]
    });

    expect(result.status).toBe("ready");
    expect(result.output.fileName).toBe("Client_Brief_merged.pdf");
    expect(result.output.totalPages).toBe(12);
    expect(result.output.estimatedSizeMb).toBe(2.2);
    expect(result.trustBoundary.mode).toBe("local-metadata-only");
  });

  it("requires at least two valid PDFs before merge planning", () => {
    const result = planPdfMerge({
      files: [{ name: "single.pdf", pages: 1, sizeBytes: 300_000, type: "application/pdf" }]
    });

    expect(result.status).toBe("blocked");
    expect(result.validationIssues).toEqual(["Add at least two PDF files to merge."]);
  });
});
