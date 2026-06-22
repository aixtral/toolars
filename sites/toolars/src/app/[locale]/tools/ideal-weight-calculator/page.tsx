import { ToolarsShell } from "@/components/shell/toolars-shell";
import { IdealWeightCalculatorWorkspace } from "./ideal-weight-calculator-workspace";

export default function IdealWeightCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <IdealWeightCalculatorWorkspace />
    </ToolarsShell>
  );
}
