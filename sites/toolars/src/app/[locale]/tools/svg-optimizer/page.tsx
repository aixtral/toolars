import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SvgOptimizerWorkspace } from "./svg-optimizer-workspace";

export default function SvgOptimizerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <SvgOptimizerWorkspace />
    </ToolarsShell>
  );
}
