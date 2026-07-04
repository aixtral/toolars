import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BarcodeGeneratorWorkspace } from "./barcode-generator-workspace";

export default function BarcodeGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <BarcodeGeneratorWorkspace />
    </ToolarsShell>
  );
}
