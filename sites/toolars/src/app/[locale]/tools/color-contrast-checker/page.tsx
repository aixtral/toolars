import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ColorContrastCheckerWorkspace } from "./color-contrast-checker-workspace";

export default function ColorContrastCheckerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ColorContrastCheckerWorkspace />
    </ToolarsShell>
  );
}
