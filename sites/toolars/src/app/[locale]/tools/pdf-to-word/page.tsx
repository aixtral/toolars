import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PdfToWordWorkspace } from "./pdf-to-word-workspace";

export default function PdfToWordPage() {
  return (
    <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
      <PdfToWordWorkspace />
    </ToolarsShell>
  );
}
