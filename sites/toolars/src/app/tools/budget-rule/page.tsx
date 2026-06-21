import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BudgetRuleWorkspace } from "./budget-rule-workspace";

export default function BudgetRulePage() {
  return (
    <ToolarsShell active="explore">
      <BudgetRuleWorkspace />
    </ToolarsShell>
  );
}
