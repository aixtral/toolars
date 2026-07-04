import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ColorConverterWorkspace } from "./color-converter-workspace";

export default function ColorConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ColorConverterWorkspace />
    </ToolarsShell>
  );
}
