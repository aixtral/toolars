import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ApyCalculatorWorkspace } from "./apy-calculator-workspace";

export default function ApyCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <ApyCalculatorWorkspace />
    </ToolarsShell>
  );
}
