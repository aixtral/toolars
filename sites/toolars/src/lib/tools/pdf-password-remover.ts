export interface PdfPasswordRemovalFile {
  name: string;
  pages: number;
  sizeBytes: number;
  type?: string;
}

export interface PdfPasswordRemovalResult {
  output?: {
    fileName: string;
    pages: number;
  };
  status: "blocked" | "ready-for-engine";
  trustBoundary: {
    mode: "local-ownership-validation";
    note: string;
    cracksPasswords: boolean;
    requiresPdfEngine: boolean;
  };
  validationIssues: string[];
}

export function planPdfPasswordRemoval({
  file,
  hasRightsToUnlock,
  passwordProvided
}: {
  file: PdfPasswordRemovalFile;
  hasRightsToUnlock: boolean;
  passwordProvided: boolean;
}): PdfPasswordRemovalResult {
  const validationIssues: string[] = [];

  if (!isPdfFile(file)) {
    validationIssues.push("Choose a PDF file before planning password removal.");
  }
  if (!hasRightsToUnlock) {
    validationIssues.push("Confirm you own the PDF or have permission to remove its password.");
  }
  if (!passwordProvided) {
    validationIssues.push("Enter the existing password before planning unlock.");
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
      fileName: `${sanitizeBaseName(file.name)}_unlocked.pdf`,
      pages: Math.max(1, file.pages)
    },
    status: "ready-for-engine",
    trustBoundary,
    validationIssues: []
  };
}

const trustBoundary = {
  mode: "local-ownership-validation" as const,
  note:
    "This workspace validates ownership intent and existing-password readiness locally; it does not crack passwords, and a PDF engine is required to decrypt and rewrite an owned PDF.",
  cracksPasswords: false,
  requiresPdfEngine: true
};

function isPdfFile(file: PdfPasswordRemovalFile): boolean {
  return file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
}

function sanitizeBaseName(name: string): string {
  return name.replace(/\.pdf$/i, "").trim().replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "toolars";
}
