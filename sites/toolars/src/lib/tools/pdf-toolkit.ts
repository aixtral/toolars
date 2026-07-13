export type PdfOperation = "merge" | "split" | "compress";
export type PdfProcessing = "local";
export type PdfJobStatus = "blocked" | "completed";

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
  if (files.length === 0) {
    return {
      status: "blocked",
      consentRequired: false,
      securityLabel: "Waiting for files",
      message: "Add at least one PDF file to continue."
    };
  }

  return {
    status: "blocked",
    consentRequired: false,
    securityLabel: "Waiting for processing",
    message: "Choose a local operation to process the queued PDFs."
  };
}
