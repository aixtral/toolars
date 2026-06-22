import { ToolarsShell } from "@/components/shell/toolars-shell";
import { InflationCalculatorWorkspace } from "./inflation-calculator-workspace";

export default function InflationCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <InflationCalculatorWorkspace />
    </ToolarsShell>
  );
}
