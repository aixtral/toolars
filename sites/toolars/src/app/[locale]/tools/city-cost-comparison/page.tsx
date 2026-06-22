import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CityCostComparisonWorkspace } from "./city-cost-comparison-workspace";

export default function CityCostComparisonPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <CityCostComparisonWorkspace />
    </ToolarsShell>
  );
}
