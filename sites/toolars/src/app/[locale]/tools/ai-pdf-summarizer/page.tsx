import { ToolarsShell } from "@/components/shell/toolars-shell";
import { AiPdfSummarizerWorkspace } from "./ai-pdf-summarizer-workspace";

export default function AiPdfSummarizerPage() {
  return (
    <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
      <AiPdfSummarizerWorkspace />
    </ToolarsShell>
  );
}
