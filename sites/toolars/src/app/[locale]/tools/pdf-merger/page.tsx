import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PdfMergerWorkspace } from "./pdf-merger-workspace";

export default function PdfMergerPage() {
  return (
    <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
      <PdfMergerWorkspace />
    </ToolarsShell>
  );
}
