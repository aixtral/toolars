import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BmiCalculatorWorkspace } from "./bmi-calculator-workspace";

export default function BmiCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <BmiCalculatorWorkspace />
    </ToolarsShell>
  );
}
