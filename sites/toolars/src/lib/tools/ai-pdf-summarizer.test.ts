import { describe, expect, it } from "vitest";
import { planAiPdfSummary } from "./ai-pdf-summarizer";

describe("planAiPdfSummary", () => {
  it("prepares a local extraction and AI-consent summary handoff for a PDF", () => {
    const result = planAiPdfSummary({
      file: { name: "Board Pack.pdf", pages: 18, sizeBytes: 8_400_000, type: "application/pdf" },
      extractedTextChars: 42_000,
      includeActionItems: true,
      summaryStyle: "executive"
    });

    expect(result.status).toBe("ready-for-ai-consent");
    expect(result.output).toMatchObject({
      estimatedTokens: 10500,
      fileName: "Board_Pack_summary.md",
      sections: ["Cited summary", "Action items", "Email draft"]
    });
    expect(result.trustBoundary).toMatchObject({
      mode: "local-extraction-ai-consent",
      requiresAiConsent: true,
      uploadsPdf: false
    });
  });

  it("blocks summary planning until a PDF and extracted text are present", () => {
    const result = planAiPdfSummary({
      file: { name: "notes.txt", pages: 1, sizeBytes: 20_000, type: "text/plain" },
      extractedTextChars: 0,
      includeActionItems: false,
      summaryStyle: "study"
    });

    expect(result.status).toBe("blocked");
    expect(result.validationIssues).toEqual([
      "Choose a PDF file before planning an AI summary.",
      "Extract text locally before sending any content to an AI model."
    ]);
  });
});
