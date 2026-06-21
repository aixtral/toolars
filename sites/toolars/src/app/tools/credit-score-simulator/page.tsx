import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CreditScoreSimulatorWorkspace } from "./credit-score-simulator-workspace";

export default function CreditScoreSimulatorPage() {
  return (
    <ToolarsShell active="explore">
      <CreditScoreSimulatorWorkspace />
    </ToolarsShell>
  );
}
