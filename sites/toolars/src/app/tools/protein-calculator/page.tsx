import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ProteinCalculatorWorkspace } from "./protein-calculator-workspace";

export default function ProteinCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <ProteinCalculatorWorkspace />
    </ToolarsShell>
  );
}
