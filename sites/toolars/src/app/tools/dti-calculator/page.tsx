import { ToolarsShell } from "@/components/shell/toolars-shell";
import { DtiCalculatorWorkspace } from "./dti-calculator-workspace";

export default function DtiCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <DtiCalculatorWorkspace />
    </ToolarsShell>
  );
}
