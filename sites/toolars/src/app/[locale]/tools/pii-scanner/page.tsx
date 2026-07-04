import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PiiScannerWorkspace } from "./pii-scanner-workspace";

export default function PiiScannerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <PiiScannerWorkspace />
    </ToolarsShell>
  );
}
