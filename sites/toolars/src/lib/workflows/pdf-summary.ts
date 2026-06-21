export type PdfSummaryStepBadge = "Local" | "AI";

export interface PdfSummaryStep {
  title: string;
  description: string;
  badge: PdfSummaryStepBadge;
}

export interface PdfSummaryResult {
  progressPercent: number;
  statusTitle: string;
  summary: string;
  securityNote: string;
}

export function buildPdfSummarySteps(): PdfSummaryStep[] {
  return [
    {
      title: "Upload PDF",
      description: "Select files from the PDF Toolkit queue or upload a new document.",
      badge: "Local"
    },
    {
      title: "Extract text locally",
      description: "Parse pages, keep layout hints, and prepare selected text on device.",
      badge: "Local"
    },
    {
      title: "Summarize with AI",
      description: "Send only approved extracted text after explicit consent.",
      badge: "AI"
    },
    {
      title: "Export summary",
      description: "Download cited notes, action items, and a share-ready brief.",
      badge: "Local"
    }
  ];
}

export function runPdfSummaryWorkflow(): PdfSummaryResult {
  return {
    progressPercent: 72,
    statusTitle: "Workflow simulated",
    summary: "Local extraction complete. AI summary is waiting for consent approval.",
    securityNote: "Only extracted text selected for summary is sent after approval."
  };
}
