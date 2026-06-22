import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SavingsGoalWorkspace } from "./savings-goal-workspace";

export default function SavingsGoalPage() {
  return (
    <ToolarsShell active="explore">
      <SavingsGoalWorkspace />
    </ToolarsShell>
  );
}
