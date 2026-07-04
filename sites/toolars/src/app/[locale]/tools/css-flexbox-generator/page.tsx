import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssFlexboxGeneratorWorkspace } from "./css-flexbox-generator-workspace";

export default function CssFlexboxGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CssFlexboxGeneratorWorkspace />
    </ToolarsShell>
  );
}
