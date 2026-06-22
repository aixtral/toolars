import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BloodSugarCalculatorWorkspace } from "./blood-sugar-calculator-workspace";

export default function BloodSugarCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <BloodSugarCalculatorWorkspace />
    </ToolarsShell>
  );
}
