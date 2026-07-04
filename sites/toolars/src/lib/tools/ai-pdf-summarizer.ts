export type PdfSummaryStyle = "executive" | "study" | "legal-review";

export interface AiPdfSummaryFile {
  name: string;
  pages: number;
  sizeBytes: number;
  type?: string;
}

export interface AiPdfSummaryPlanResult {
  output?: {
    estimatedTokens: number;
    fileName: string;
    pages: number;
    sections: string[];
    style: PdfSummaryStyle;
  };
  status: "blocked" | "ready-for-ai-consent";
  trustBoundary: {
    mode: "local-extraction-ai-consent";
    note: string;
    requiresAiConsent: boolean;
    uploadsPdf: boolean;
  };
  validationIssues: string[];
}

export function planAiPdfSummary({
  extractedTextChars,
  file,
  includeActionItems,
  summaryStyle
}: {
  extractedTextChars: number;
  file: AiPdfSummaryFile;
  includeActionItems: boolean;
  summaryStyle: PdfSummaryStyle;
}): AiPdfSummaryPlanResult {
  const validationIssues: string[] = [];

  if (!isPdfFile(file)) {
    validationIssues.push("Choose a PDF file before planning an AI summary.");
  }
  if (extractedTextChars <= 0) {
    validationIssues.push("Extract text locally before sending any content to an AI model.");
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
      fileName: `${sanitizeBaseName(file.name)}_summary.md`,
      pages: Math.max(1, file.pages),
      sections: getSummarySections(summaryStyle, includeActionItems),
      style: summaryStyle
    },
    status: "ready-for-ai-consent",
    trustBoundary,
    validationIssues: []
  };
}

const trustBoundary = {
  mode: "local-extraction-ai-consent" as const,
  note:
    "This workspace plans summary scope from local PDF metadata and extracted text counts; extracted text reaches a model route only after explicit AI consent, and the planner does not upload the raw PDF.",
  requiresAiConsent: true,
  uploadsPdf: false
};

function getSummarySections(style: PdfSummaryStyle, includeActionItems: boolean): string[] {
  const sections = ["Cited summary"];
  if (includeActionItems) {
    sections.push("Action items");
  }
  sections.push(style === "study" ? "Study notes" : style === "legal-review" ? "Risk notes" : "Email draft");
  return sections;
}

function isPdfFile(file: AiPdfSummaryFile): boolean {
  return file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
}

function estimateTokens(characters: number): number {
  return Math.ceil(characters / 4);
}

function sanitizeBaseName(name: string): string {
  return name.replace(/\.pdf$/i, "").trim().replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "toolars";
}
