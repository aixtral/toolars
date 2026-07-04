import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssBoxShadowGeneratorWorkspace } from "./css-box-shadow-generator-workspace";

export default function CssBoxShadowGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CssBoxShadowGeneratorWorkspace />
    </ToolarsShell>
  );
}
