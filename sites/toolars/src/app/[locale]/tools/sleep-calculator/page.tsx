import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SleepCalculatorWorkspace } from "./sleep-calculator-workspace";

export default function SleepCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <SleepCalculatorWorkspace />
    </ToolarsShell>
  );
}
