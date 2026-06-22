import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TestosteroneCalculatorWorkspace } from "./testosterone-calculator-workspace";

export default function TestosteroneCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <TestosteroneCalculatorWorkspace />
    </ToolarsShell>
  );
}
