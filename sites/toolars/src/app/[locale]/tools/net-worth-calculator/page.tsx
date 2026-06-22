import { ToolarsShell } from "@/components/shell/toolars-shell";
import { NetWorthCalculatorWorkspace } from "./net-worth-calculator-workspace";

export default function NetWorthCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <NetWorthCalculatorWorkspace />
    </ToolarsShell>
  );
}
