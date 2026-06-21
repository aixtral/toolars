import { ToolarsShell } from "@/components/shell/toolars-shell";
import { OvulationCalculatorWorkspace } from "./ovulation-calculator-workspace";

export default function OvulationCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <OvulationCalculatorWorkspace />
    </ToolarsShell>
  );
}
