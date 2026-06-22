import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TipCalculatorWorkspace } from "./tip-calculator-workspace";

export default function TipCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <TipCalculatorWorkspace />
    </ToolarsShell>
  );
}
