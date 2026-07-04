import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TokenBudgetPlannerWorkspace } from "./token-budget-planner-workspace";

export default function TokenBudgetPlannerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <TokenBudgetPlannerWorkspace />
    </ToolarsShell>
  );
}
