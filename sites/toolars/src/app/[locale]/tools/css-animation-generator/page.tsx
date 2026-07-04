import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssAnimationGeneratorWorkspace } from "./css-animation-generator-workspace";

export default function CssAnimationGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CssAnimationGeneratorWorkspace />
    </ToolarsShell>
  );
}
