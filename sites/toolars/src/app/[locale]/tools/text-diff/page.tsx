import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TextDiffWorkspace } from "./text-diff-workspace";

export default function TextDiffPage() {
  return (
    <ToolarsShell active="ai-developer">
      <TextDiffWorkspace />
    </ToolarsShell>
  );
}
