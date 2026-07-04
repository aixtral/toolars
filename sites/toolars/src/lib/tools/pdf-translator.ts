export type PdfTranslationLanguage = "en" | "es" | "fr" | "ja" | "zh-hans" | "zh-hant";

export interface PdfTranslationFile {
  name: string;
  pages: number;
  sizeBytes: number;
  type?: string;
}

export interface PdfTranslationPlanResult {
  output?: {
    estimatedTokens: number;
    fileName: string;
    layoutMode: "flowing-text" | "layout-aware";
    pages: number;
    targetLanguage: PdfTranslationLanguage;
  };
  status: "blocked" | "ready-for-ai-consent";
  trustBoundary: {
    mode: "local-extraction-ai-consent";
    note: string;
    requiresAiConsent: boolean;
    requiresPdfEngine: boolean;
  };
  validationIssues: string[];
}

export function planPdfTranslation({
  extractedTextChars,
  file,
  preserveLayout,
  sourceLanguage,
  targetLanguage
}: {
  extractedTextChars: number;
  file: PdfTranslationFile;
  preserveLayout: boolean;
  sourceLanguage: PdfTranslationLanguage;
  targetLanguage: PdfTranslationLanguage;
}): PdfTranslationPlanResult {
  const validationIssues: string[] = [];

  if (!isPdfFile(file)) {
    validationIssues.push("Choose a PDF file before planning translation.");
  }
  if (sourceLanguage === targetLanguage) {
    validationIssues.push("Choose a target language different from the source language.");
  }
  if (extractedTextChars <= 0) {
    validationIssues.push("Extract text locally before sending any content to a translation model.");
  }

  if (validationIssues.length > 0) {
    return {
      status: "blocked",
      trustBoundary,
      validationIssues
    };
  }

  return {
    output: {
      estimatedTokens: estimateTokens(extractedTextChars),
      fileName: `${sanitizeBaseName(file.name)}_${targetLanguage}_translation.pdf`,
      layoutMode: preserveLayout ? "layout-aware" : "flowing-text",
      pages: Math.max(1, file.pages),
      targetLanguage
    },
    status: "ready-for-ai-consent",
    trustBoundary,
    validationIssues: []
  };
}

const trustBoundary = {
  mode: "local-extraction-ai-consent" as const,
  note:
    "This workspace validates PDF metadata and extracted text locally; translated text leaves for a model route only after AI consent, and layout-aware PDF output still requires a PDF engine.",
  requiresAiConsent: true,
  requiresPdfEngine: true
};

function isPdfFile(file: PdfTranslationFile): boolean {
  return file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
}

function estimateTokens(characters: number): number {
  return Math.ceil(characters / 4);
}

function sanitizeBaseName(name: string): string {
  return name.replace(/\.pdf$/i, "").trim().replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "toolars";
}
