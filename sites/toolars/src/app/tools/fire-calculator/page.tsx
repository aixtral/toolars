import { ToolarsShell } from "@/components/shell/toolars-shell";
import { FireCalculatorWorkspace } from "./fire-calculator-workspace";

export default function FireCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <FireCalculatorWorkspace />
    </ToolarsShell>
  );
}
