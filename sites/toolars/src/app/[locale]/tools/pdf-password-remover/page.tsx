import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PdfPasswordRemoverWorkspace } from "./pdf-password-remover-workspace";

export default function PdfPasswordRemoverPage() {
  return (
    <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
      <PdfPasswordRemoverWorkspace />
    </ToolarsShell>
  );
}
