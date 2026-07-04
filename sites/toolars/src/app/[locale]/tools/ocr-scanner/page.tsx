import { ToolarsShell } from "@/components/shell/toolars-shell";
import { OcrScannerWorkspace } from "./ocr-scanner-workspace";

export default function OcrScannerPage() {
  return (
    <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
      <OcrScannerWorkspace />
    </ToolarsShell>
  );
}
