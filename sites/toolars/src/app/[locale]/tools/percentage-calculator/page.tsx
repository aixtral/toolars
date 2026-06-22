import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PercentageCalculatorWorkspace } from "./percentage-calculator-workspace";

export default function PercentageCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <PercentageCalculatorWorkspace />
    </ToolarsShell>
  );
}
