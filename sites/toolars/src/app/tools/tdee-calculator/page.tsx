import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TdeeCalculatorWorkspace } from "./tdee-calculator-workspace";

export default function TdeeCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <TdeeCalculatorWorkspace />
    </ToolarsShell>
  );
}
