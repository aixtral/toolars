export type PdfOperation = "merge" | "split" | "compress" | "convert" | "summarize";
export type PdfProcessing = "local" | "ai-consent";
export type PdfJobStatus = "blocked" | "needs-consent" | "completed";

export interface PdfFile {
  id: string;
  name: string;
  sizeMb: number;
  pages: number;
  source: "local" | "drive";
}

export interface PdfOperationPolicy {
  operation: PdfOperation;
  label: string;
  description: string;
  processing: PdfProcessing;
  consentRequired: boolean;
  primaryAction: string;
}

export interface PdfOutput {
  fileName: string;
  sizeMb: number;
  pages: number;
  summary?: string;
  citations?: string[];
}

export interface PdfJobResult {
  status: PdfJobStatus;
  consentRequired: boolean;
  securityLabel: string;
  message: string;
  output?: PdfOutput;
}

export const samplePdfFiles: PdfFile[] = [
  {
    id: "q2-report",
    name: "Q2_Marketing_Report_2024.pdf",
    sizeMb: 2.4,
    pages: 24,
    source: "local"
  },
  {
    id: "market-analysis",
    name: "Market_Analysis_2024.pdf",
    sizeMb: 1.8,
    pages: 18,
    source: "local"
  },
  {
    id: "campaign-brief",
    name: "Campaign_Brief_Q2.pdf",
    sizeMb: 0.8,
    pages: 6,
    source: "drive"
  }
];

const operationPolicies: Record<PdfOperation, PdfOperationPolicy> = {
  merge: {
    operation: "merge",
    label: "Merge",
    description: "Combine files in the listed order.",
    processing: "local",
    consentRequired: false,
    primaryAction: "Merge PDFs"
  },
  split: {
    operation: "split",
    label: "Split",
    description: "Create separate files from page ranges.",
    processing: "local",
    consentRequired: false,
    primaryAction: "Split PDF"
  },
  compress: {
    operation: "compress",
    label: "Compress",
    description: "Reduce image weight and remove redundant data.",
    processing: "local",
    consentRequired: false,
    primaryAction: "Compress PDF"
  },
  convert: {
    operation: "convert",
    label: "Convert",
    description: "Export pages to editable document formats.",
    processing: "local",
    consentRequired: false,
    primaryAction: "Convert PDF"
  },
  summarize: {
    operation: "summarize",
    label: "Summarize",
    description: "Generate key takeaways and citations with AI.",
    processing: "ai-consent",
    consentRequired: true,
    primaryAction: "Generate summary"
  }
};

export function getPdfOperationPolicy(operation: PdfOperation): PdfOperationPolicy {
  return operationPolicies[operation];
}

export function getPdfOperationPolicies(): PdfOperationPolicy[] {
  return Object.values(operationPolicies);
}

export function buildPdfJob({
  files,
  operation,
  consentGranted
}: {
  files: PdfFile[];
  operation: PdfOperation;
  consentGranted: boolean;
}): PdfJobResult {
  const policy = getPdfOperationPolicy(operation);

  if (files.length === 0) {
    return {
      status: "blocked",
      consentRequired: policy.consentRequired,
      securityLabel: "Waiting for files",
      message: "Add at least one PDF file to continue."
    };
  }

  if (policy.consentRequired && !consentGranted) {
    return {
      status: "needs-consent",
      consentRequired: true,
      securityLabel: "AI consent required",
      message: "Consent required before AI processing."
    };
  }

  return {
    status: "completed",
    consentRequired: policy.consentRequired,
    securityLabel: policy.consentRequired ? "AI consent granted" : "Processed locally",
    message: policy.consentRequired ? "AI processing complete" : "Local processing complete",
    output: buildOutput(files, operation)
  };
}

function buildOutput(files: PdfFile[], operation: PdfOperation): PdfOutput {
  const totalPages = files.reduce((sum, file) => sum + file.pages, 0);
  const totalSize = files.reduce((sum, file) => sum + file.sizeMb, 0);
  const baseName = files[0]?.name.replace(/\.pdf$/i, "") ?? "toolars-output";

  if (operation === "compress") {
    return {
      fileName: `${baseName}_compressed.pdf`,
      sizeMb: roundMb(totalSize * 0.72),
      pages: totalPages
    };
  }

  if (operation === "split") {
    return {
      fileName: `${baseName}_split.zip`,
      sizeMb: roundMb(totalSize),
      pages: totalPages
    };
  }

  if (operation === "convert") {
    return {
      fileName: `${baseName}.docx`,
      sizeMb: roundMb(totalSize * 0.94),
      pages: totalPages
    };
  }

  if (operation === "summarize") {
    return {
      fileName: `${baseName}_summary.md`,
      sizeMb: 0.1,
      pages: totalPages,
      summary:
        "This document is a Q2 2024 marketing report that outlines campaign performance, budget utilization, key wins, challenges, and recommendations for the next quarter.",
      citations: ["p. 3 Q2 Performance Overview", "p. 8 Campaign Results", "p. 12 Budget Summary"]
    };
  }

  return {
    fileName: `${baseName}_merged.pdf`,
    sizeMb: roundMb(totalSize * 0.93),
    pages: totalPages
  };
}

function roundMb(value: number): number {
  return Math.round(value * 10) / 10;
}
