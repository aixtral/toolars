import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PdfCompressorWorkspace } from "./pdf-compressor-workspace";

export default function PdfCompressorPage() {
  return (
    <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
      <PdfCompressorWorkspace />
    </ToolarsShell>
  );
}
