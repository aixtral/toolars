import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MacroCalculatorWorkspace } from "./macro-calculator-workspace";

export default function MacroCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <MacroCalculatorWorkspace />
    </ToolarsShell>
  );
}
