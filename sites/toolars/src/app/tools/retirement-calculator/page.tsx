import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RetirementCalculatorWorkspace } from "./retirement-calculator-workspace";

export default function RetirementCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <RetirementCalculatorWorkspace />
    </ToolarsShell>
  );
}
