import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CreatineCalculatorWorkspace } from "./creatine-calculator-workspace";

export default function CreatineCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <CreatineCalculatorWorkspace />
    </ToolarsShell>
  );
}
