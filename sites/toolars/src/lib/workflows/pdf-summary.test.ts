import { describe, expect, it } from "vitest";
import { buildPdfSummaryPrompt, buildPdfSummarySteps, runPdfSummaryWorkflow } from "./pdf-summary";

describe("pdf summary workflow", () => {
  it("builds the PDF summary steps with AI consent scoped to summarization", () => {
    const steps = buildPdfSummarySteps();

    expect(steps).toHaveLength(4);
    expect(steps.map((step) => step.title)).toEqual([
      "Upload PDF",
      "Extract text locally",
      "Summarize with AI",
      "Export summary"
    ]);
    expect(steps[2].badge).toBe("AI");
    expect(steps.filter((step) => step.badge === "Local")).toHaveLength(3);
  });

  it("simulates the default workflow run and waits at the consent gate", () => {
    const result = runPdfSummaryWorkflow();

    expect(result.progressPercent).toBe(72);
    expect(result.statusTitle).toBe("Workflow simulated");
    expect(result.summary).toContain("Local extraction complete");
    expect(result.summary).toContain("AI summary is waiting for consent approval");
    expect(result.securityNote).toContain("Only extracted text selected for summary is sent");
  });

  it("builds a deterministic provider prompt from the variation and uploaded files", () => {
    const prompt = buildPdfSummaryPrompt("boardPack", ["Q2_Marketing_Report_2024.pdf", "Notes.pdf"]);

    expect(prompt).toContain("Q2_Marketing_Report_2024.pdf, Notes.pdf");
    expect(prompt).toContain('"boardPack" brief');
    expect(prompt).toContain("action items");
    expect(prompt).toContain("under 200 words");
  });

  it("falls back to a generic document reference when no files are queued", () => {
    expect(buildPdfSummaryPrompt("clientSummary", [])).toContain("the uploaded PDF document");
  });
});
