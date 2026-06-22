import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BillSplitCalculatorWorkspace } from "./bill-split-calculator-workspace";

export default function BillSplitCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <BillSplitCalculatorWorkspace />
    </ToolarsShell>
  );
}
