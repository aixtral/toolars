import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RunningPaceWorkspace } from "./running-pace-workspace";

export default function RunningPacePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <RunningPaceWorkspace />
    </ToolarsShell>
  );
}
