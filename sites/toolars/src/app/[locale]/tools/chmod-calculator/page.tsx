import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ChmodCalculatorWorkspace } from "./chmod-calculator-workspace";

export default function ChmodCalculatorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ChmodCalculatorWorkspace />
    </ToolarsShell>
  );
}
