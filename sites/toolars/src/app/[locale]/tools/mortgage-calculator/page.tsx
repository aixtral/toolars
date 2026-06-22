import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MortgageCalculatorWorkspace } from "./mortgage-calculator-workspace";

export default function MortgageCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <MortgageCalculatorWorkspace />
    </ToolarsShell>
  );
}
