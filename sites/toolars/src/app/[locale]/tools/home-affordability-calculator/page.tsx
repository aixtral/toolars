import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HomeAffordabilityCalculatorWorkspace } from "./home-affordability-calculator-workspace";

export default function HomeAffordabilityCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <HomeAffordabilityCalculatorWorkspace />
    </ToolarsShell>
  );
}
