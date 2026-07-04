import { describe, expect, it } from "vitest";
import { planPdfToWordConversion } from "./pdf-to-word";

describe("planPdfToWordConversion", () => {
  it("builds a DOCX conversion handoff from local PDF metadata", () => {
    const result = planPdfToWordConversion({
      file: { name: "Proposal.pdf", pages: 8, sizeBytes: 1_200_000, type: "application/pdf" },
      preserveLayout: true
    });

    expect(result.status).toBe("ready-for-handoff");
    if (!result.output) throw new Error("Expected DOCX handoff output");
    expect(result.output.fileName).toBe("Proposal.docx");
    expect(result.output.estimatedSizeMb).toBe(1);
    expect(result.trustBoundary.requiresBackend).toBe(true);
    expect(result.steps.map((step) => step.status)).toEqual(["complete", "complete", "requires-service"]);
  });

  it("does not claim conversion when the selected file is not a PDF", () => {
    const result = planPdfToWordConversion({
      file: { name: "notes.txt", pages: 1, sizeBytes: 2_000, type: "text/plain" },
      preserveLayout: false
    });

    expect(result.status).toBe("blocked");
    expect(result.output).toBeUndefined();
    expect(result.validationIssues).toContain("Choose a PDF file before planning DOCX conversion.");
  });
});
