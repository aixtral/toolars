import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MortgageRefinanceCalculatorWorkspace } from "./mortgage-refinance-calculator-workspace";

export default function MortgageRefinanceCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <MortgageRefinanceCalculatorWorkspace />
    </ToolarsShell>
  );
}
