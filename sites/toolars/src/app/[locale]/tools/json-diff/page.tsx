import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonDiffWorkspace } from "./json-diff-workspace";

export default function JsonDiffPage() {
  return (
    <ToolarsShell active="ai-developer">
      <JsonDiffWorkspace />
    </ToolarsShell>
  );
}
