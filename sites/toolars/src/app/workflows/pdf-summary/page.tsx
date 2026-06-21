import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PdfSummaryWorkflow } from "./pdf-summary-workflow";

export default function PdfSummaryWorkflowPage() {
  return (
    <ToolarsShell active="workflows" sidebarVariant="workflows">
      <PdfSummaryWorkflow />
    </ToolarsShell>
  );
}
