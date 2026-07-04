import { ToolarsShell } from "@/components/shell/toolars-shell";
import { QrCodeGeneratorWorkspace } from "./qr-code-generator-workspace";

export default function QrCodeGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <QrCodeGeneratorWorkspace />
    </ToolarsShell>
  );
}
