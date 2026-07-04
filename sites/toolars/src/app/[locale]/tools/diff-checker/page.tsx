import { ToolarsShell } from "@/components/shell/toolars-shell";
import { DiffCheckerWorkspace } from "./diff-checker-workspace";

export default function DiffCheckerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <DiffCheckerWorkspace />
    </ToolarsShell>
  );
}
