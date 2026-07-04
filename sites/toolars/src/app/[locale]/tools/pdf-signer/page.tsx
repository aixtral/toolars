import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PdfSignerWorkspace } from "./pdf-signer-workspace";

export default function PdfSignerPage() {
  return (
    <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
      <PdfSignerWorkspace />
    </ToolarsShell>
  );
}
