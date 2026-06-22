import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PdfToolkitWorkspace } from "./pdf-toolkit-workspace";

export default function PdfToolkitPage() {
  return (
    <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
      <PdfToolkitWorkspace />
    </ToolarsShell>
  );
}
