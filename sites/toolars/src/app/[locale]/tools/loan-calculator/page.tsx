import { ToolarsShell } from "@/components/shell/toolars-shell";
import { LoanCalculatorWorkspace } from "./loan-calculator-workspace";

export default function LoanCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <LoanCalculatorWorkspace />
    </ToolarsShell>
  );
}
