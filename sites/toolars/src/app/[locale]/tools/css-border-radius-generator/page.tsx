import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssBorderRadiusGeneratorWorkspace } from "./css-border-radius-generator-workspace";

export default function CssBorderRadiusGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CssBorderRadiusGeneratorWorkspace />
    </ToolarsShell>
  );
}
