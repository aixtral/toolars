export type PdfSignatureIntent = "drawn" | "typed" | "certificate";

export interface PdfSignatureFile {
  name: string;
  pages: number;
  sizeBytes: number;
  type?: string;
}

export interface PdfSignaturePlanResult {
  output?: {
    fileName: string;
    page: number;
    signatureIntent: PdfSignatureIntent;
    signerName: string;
  };
  status: "blocked" | "ready-for-signing-engine";
  trustBoundary: {
    mode: "local-signature-placement";
    note: string;
    embedsSignature: boolean;
    requiresPdfEngine: boolean;
  };
  validationIssues: string[];
}

export function planPdfSignature({
  file,
  page,
  signatureIntent,
  signerName
}: {
  file: PdfSignatureFile;
  page: number;
  signatureIntent: PdfSignatureIntent;
  signerName: string;
}): PdfSignaturePlanResult {
  const validationIssues: string[] = [];
  const safePages = Math.max(1, file.pages);

  if (!isPdfFile(file)) {
    validationIssues.push("Choose a PDF file before planning a signature.");
  }
  if (!signerName.trim()) {
    validationIssues.push("Add the signer name before planning a signature.");
  }
  if (page < 1 || page > safePages) {
    validationIssues.push(`Signature page must be between 1 and ${safePages}.`);
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
      fileName: `${sanitizeBaseName(file.name)}_signed.pdf`,
      page,
      signatureIntent,
      signerName: signerName.trim()
    },
    status: "ready-for-signing-engine",
    trustBoundary,
    validationIssues: []
  };
}

const trustBoundary = {
  mode: "local-signature-placement" as const,
  note:
    "This workspace plans signer name, signature type, and page placement locally; the signature is not embedded until a PDF signing engine applies it.",
  embedsSignature: false,
  requiresPdfEngine: true
};

function isPdfFile(file: PdfSignatureFile): boolean {
  return file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
}

function sanitizeBaseName(name: string): string {
  return name.replace(/\.pdf$/i, "").trim().replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "toolars";
}
