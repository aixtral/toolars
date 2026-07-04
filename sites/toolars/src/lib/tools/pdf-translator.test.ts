import { describe, expect, it } from "vitest";
import { planPdfTranslation } from "./pdf-translator";

describe("planPdfTranslation", () => {
  it("prepares a local extraction and AI-consent translation handoff", () => {
    const result = planPdfTranslation({
      extractedTextChars: 24_000,
      file: { name: "Product Manual.pdf", pages: 32, sizeBytes: 7_200_000, type: "application/pdf" },
      preserveLayout: true,
      sourceLanguage: "en",
      targetLanguage: "es"
    });

    expect(result.status).toBe("ready-for-ai-consent");
    expect(result.output).toMatchObject({
      estimatedTokens: 6000,
      fileName: "Product_Manual_es_translation.pdf",
      layoutMode: "layout-aware"
    });
    expect(result.trustBoundary).toMatchObject({
      mode: "local-extraction-ai-consent",
      requiresAiConsent: true,
      requiresPdfEngine: true
    });
  });

  it("blocks translation planning until there is PDF text and a different target language", () => {
    const result = planPdfTranslation({
      extractedTextChars: 0,
      file: { name: "Manual.pdf", pages: 4, sizeBytes: 900_000, type: "application/pdf" },
      preserveLayout: false,
      sourceLanguage: "en",
      targetLanguage: "en"
    });

    expect(result.status).toBe("blocked");
    expect(result.validationIssues).toEqual([
      "Choose a target language different from the source language.",
      "Extract text locally before sending any content to a translation model."
    ]);
  });
});
