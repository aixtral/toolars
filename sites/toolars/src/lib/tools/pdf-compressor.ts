export type PdfCompressionProfile = "screen" | "balanced" | "print";

export interface PdfCompressionFile {
  name: string;
  pages: number;
  sizeBytes: number;
  type?: string;
}

export interface PdfCompressionResult {
  output: {
    estimatedSizeMb: number;
    fileName: string;
    originalSizeMb: number;
    savingsPercent: number;
  };
  status: "blocked" | "ready";
  trustBoundary: {
    mode: "local-estimate";
    note: string;
  };
  validationIssues: string[];
}

const profileRatios: Record<PdfCompressionProfile, number> = {
  balanced: 0.62,
  print: 0.78,
  screen: 0.45
};

export function estimatePdfCompression({
  file,
  profile,
  removeMetadata
}: {
  file: PdfCompressionFile;
  profile: PdfCompressionProfile;
  removeMetadata: boolean;
}): PdfCompressionResult {
  const validationIssues = isPdfFile(file) ? [] : ["Add a PDF file before estimating compression."];
  const originalSizeMb = roundMb(file.sizeBytes / 1024 / 1024);

  if (validationIssues.length > 0) {
    return {
      output: {
        estimatedSizeMb: 0,
        fileName: "",
        originalSizeMb,
        savingsPercent: 0
      },
      status: "blocked",
      trustBoundary: compressionTrustBoundary,
      validationIssues
    };
  }

  const ratio = Math.max(0.35, profileRatios[profile] - (removeMetadata ? 0.03 : 0));
  const estimatedSizeMb = roundMb(originalSizeMb * ratio);

  return {
    output: {
      estimatedSizeMb,
      fileName: `${sanitizePdfBaseName(file.name)}_compressed.pdf`,
      originalSizeMb,
      savingsPercent: Math.round((1 - estimatedSizeMb / originalSizeMb) * 100)
    },
    status: "ready",
    trustBoundary: compressionTrustBoundary,
    validationIssues: []
  };
}

const compressionTrustBoundary = {
  mode: "local-estimate" as const,
  note: "This workspace estimates compression from metadata locally; actual image downsampling and PDF rewriting need a PDF engine."
};

function isPdfFile(file: PdfCompressionFile): boolean {
  return file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
}

function sanitizePdfBaseName(name: string): string {
  return name.replace(/\.pdf$/i, "").trim().replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "toolars";
}

function roundMb(value: number): number {
  return Math.round(value * 10) / 10;
}
