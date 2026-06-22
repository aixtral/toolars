import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CaffeineCalculatorWorkspace } from "./caffeine-calculator-workspace";

export default function CaffeineCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <CaffeineCalculatorWorkspace />
    </ToolarsShell>
  );
}
