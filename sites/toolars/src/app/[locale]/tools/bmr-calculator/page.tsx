import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BmrCalculatorWorkspace } from "./bmr-calculator-workspace";

export default function BmrCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <BmrCalculatorWorkspace />
    </ToolarsShell>
  );
}
