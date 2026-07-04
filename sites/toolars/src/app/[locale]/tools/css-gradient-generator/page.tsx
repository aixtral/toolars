import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssGradientGeneratorWorkspace } from "./css-gradient-generator-workspace";

export default function CssGradientGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CssGradientGeneratorWorkspace />
    </ToolarsShell>
  );
}
