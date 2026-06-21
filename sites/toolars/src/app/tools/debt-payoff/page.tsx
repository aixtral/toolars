import { ToolarsShell } from "@/components/shell/toolars-shell";
import { DebtPayoffWorkspace } from "./debt-payoff-workspace";

export default function DebtPayoffPage() {
  return (
    <ToolarsShell active="explore">
      <DebtPayoffWorkspace />
    </ToolarsShell>
  );
}
