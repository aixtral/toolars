import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RoiCalculatorWorkspace } from "./roi-calculator-workspace";

export default function RoiCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <RoiCalculatorWorkspace />
    </ToolarsShell>
  );
}
