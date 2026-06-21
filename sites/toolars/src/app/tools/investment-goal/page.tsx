import { ToolarsShell } from "@/components/shell/toolars-shell";
import { InvestmentGoalWorkspace } from "./investment-goal-workspace";

export default function InvestmentGoalPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <InvestmentGoalWorkspace />
    </ToolarsShell>
  );
}
