export interface PdfToWordFile {
  name: string;
  pages: number;
  sizeBytes: number;
  type?: string;
}

export interface PdfToWordPlanResult {
  output?: {
    estimatedSizeMb: number;
    fileName: string;
    pages: number;
  };
  status: "blocked" | "ready-for-handoff";
  steps: Array<{ label: string; status: "blocked" | "complete" | "requires-service" }>;
  trustBoundary: {
    mode: "local-validation-handoff";
    note: string;
    requiresBackend: boolean;
  };
  validationIssues: string[];
}

export function planPdfToWordConversion({
  file,
  preserveLayout
}: {
  file: PdfToWordFile;
  preserveLayout: boolean;
}): PdfToWordPlanResult {
  const validationIssues = isPdfFile(file) ? [] : ["Choose a PDF file before planning DOCX conversion."];

  if (validationIssues.length > 0) {
    return {
      status: "blocked",
      steps: [
        { label: "Validate PDF", status: "blocked" },
        { label: preserveLayout ? "Preserve layout" : "Extract flowing text", status: "blocked" },
        { label: "Generate DOCX", status: "blocked" }
      ],
      trustBoundary,
      validationIssues
    };
  }

  return {
    output: {
      estimatedSizeMb: roundMb((file.sizeBytes / 1024 / 1024) * (preserveLayout ? 0.86 : 0.68)),
      fileName: `${sanitizeBaseName(file.name)}.docx`,
      pages: file.pages
    },
    status: "ready-for-handoff",
    steps: [
      { label: "Validate PDF", status: "complete" },
      { label: preserveLayout ? "Preserve layout hints" : "Prefer editable flowing text", status: "complete" },
      { label: "Generate DOCX", status: "requires-service" }
    ],
    trustBoundary,
    validationIssues: []
  };
}

const trustBoundary = {
  mode: "local-validation-handoff" as const,
  note: "Actual DOCX generation requires a conversion service after this local validation step.",
  requiresBackend: true
};

function isPdfFile(file: PdfToWordFile): boolean {
  return file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
}

function sanitizeBaseName(name: string): string {
  return name.replace(/\.pdf$/i, "").trim().replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "toolars";
}

function roundMb(value: number): number {
  return Math.round(value * 10) / 10;
}
