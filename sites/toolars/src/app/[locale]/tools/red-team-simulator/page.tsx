import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RedTeamSimulatorWorkspace } from "./red-team-simulator-workspace";

export default function RedTeamSimulatorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <RedTeamSimulatorWorkspace />
    </ToolarsShell>
  );
}
