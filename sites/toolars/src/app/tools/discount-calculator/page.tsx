import { ToolarsShell } from "@/components/shell/toolars-shell";
import { DiscountCalculatorWorkspace } from "./discount-calculator-workspace";

export default function DiscountCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <DiscountCalculatorWorkspace />
    </ToolarsShell>
  );
}
