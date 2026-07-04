export interface PdfMergeFile {
  name: string;
  pages: number;
  sizeBytes: number;
  type?: string;
}

export interface PdfMergePlanOutput {
  estimatedSizeMb: number;
  fileName: string;
  totalPages: number;
}

export interface PdfMergePlanResult {
  output: PdfMergePlanOutput;
  status: "blocked" | "ready";
  steps: Array<{ label: string; status: "blocked" | "complete" | "ready" }>;
  trustBoundary: {
    mode: "local-metadata-only";
    note: string;
  };
  validationIssues: string[];
}

const blockedOutput: PdfMergePlanOutput = {
  estimatedSizeMb: 0,
  fileName: "",
  totalPages: 0
};

export function planPdfMerge({ files }: { files: PdfMergeFile[] }): PdfMergePlanResult {
  const validFiles = files.filter(isPdfFile);
  const validationIssues: string[] = [];

  if (validFiles.length < 2) {
    validationIssues.push("Add at least two PDF files to merge.");
  }

  const totalPages = validFiles.reduce((sum, file) => sum + Math.max(0, file.pages), 0);
  const totalBytes = validFiles.reduce((sum, file) => sum + Math.max(0, file.sizeBytes), 0);
  const status = validationIssues.length > 0 ? "blocked" : "ready";
  const firstName = validFiles[0]?.name ?? "toolars";

  return {
    output:
      status === "ready"
        ? {
            estimatedSizeMb: roundMb((totalBytes / 1024 / 1024) * 0.96),
            fileName: `${sanitizePdfBaseName(firstName)}_merged.pdf`,
            totalPages
          }
        : blockedOutput,
    status,
    steps: [
      { label: "Validate PDF queue", status: validFiles.length > 0 ? "complete" : "blocked" },
      { label: "Preserve listed order", status: validFiles.length >= 2 ? "complete" : "blocked" },
      { label: "Create merge output plan", status: status === "ready" ? "ready" : "blocked" }
    ],
    trustBoundary: {
      mode: "local-metadata-only",
      note: "This workspace plans ordering, page counts, and output naming locally; binary PDF merging needs a browser PDF engine or server worker."
    },
    validationIssues
  };
}

function isPdfFile(file: PdfMergeFile): boolean {
  return file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
}

function sanitizePdfBaseName(name: string): string {
  return name.replace(/\.pdf$/i, "").trim().replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "toolars";
}

function roundMb(value: number): number {
  return Math.round(value * 10) / 10;
}
