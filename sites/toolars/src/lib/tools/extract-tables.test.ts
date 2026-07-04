import { describe, expect, it } from "vitest";
import { planTableExtraction } from "./extract-tables";

describe("planTableExtraction", () => {
  it("creates a table extraction handoff with parsed page range metadata", () => {
    const result = planTableExtraction({
      file: { name: "Q2 Report.pdf", pages: 12, sizeBytes: 2_400_000, type: "application/pdf" },
      outputFormat: "csv",
      pageRange: "2-5"
    });

    expect(result.status).toBe("ready-for-extractor");
    if (!result.output) throw new Error("Expected table extraction output");
    expect(result.output.fileName).toBe("Q2_Report_tables.csv");
    expect(result.output.selectedPages).toBe(4);
    expect(result.output.estimatedTables).toBe(4);
    expect(result.trustBoundary.requiresBackend).toBe(true);
  });

  it("rejects page ranges that exceed the known PDF page count", () => {
    const result = planTableExtraction({
      file: { name: "Q2 Report.pdf", pages: 12, sizeBytes: 2_400_000, type: "application/pdf" },
      outputFormat: "xlsx",
      pageRange: "10-20"
    });

    expect(result.status).toBe("blocked");
    expect(result.validationIssues).toContain("Page range must stay between 1 and 12.");
  });
});
