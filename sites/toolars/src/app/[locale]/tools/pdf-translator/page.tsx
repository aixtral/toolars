import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PdfTranslatorWorkspace } from "./pdf-translator-workspace";

export default function PdfTranslatorPage() {
  return (
    <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
      <PdfTranslatorWorkspace />
    </ToolarsShell>
  );
}
