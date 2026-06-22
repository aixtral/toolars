import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BodyFatCalculatorWorkspace } from "./body-fat-calculator-workspace";

export default function BodyFatCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <BodyFatCalculatorWorkspace />
    </ToolarsShell>
  );
}
