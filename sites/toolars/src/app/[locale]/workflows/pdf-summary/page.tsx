import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PdfSummaryWorkflow } from "./pdf-summary-workflow";

export const metadata: Metadata = {
  title: "Turn PDF into summary workflow",
  description: "Extract PDF content, summarize with AI consent, and export key points in one workflow.",
  alternates: { canonical: "/workflows/pdf-summary" },
  openGraph: {
    type: "website",
    title: "Turn PDF into summary — Toolars",
    description: "Extract PDF content, summarize with AI consent, and export key points.",
    url: "/workflows/pdf-summary"
  }
};

export default function PdfSummaryWorkflowPage() {
  return (
    <ToolarsShell active="workflows" sidebarVariant="workflows">
      <PdfSummaryWorkflow />
    </ToolarsShell>
  );
}
