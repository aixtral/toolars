import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TextStatsWorkspace } from "./text-stats-workspace";

export default function TextStatsPage() {
  return (
    <ToolarsShell active="ai-developer">
      <TextStatsWorkspace />
    </ToolarsShell>
  );
}
