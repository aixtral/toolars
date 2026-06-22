import { ToolarsShell } from "@/components/shell/toolars-shell";
import { StockAverageWorkspace } from "./stock-average-workspace";

export default function StockAveragePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <StockAverageWorkspace />
    </ToolarsShell>
  );
}
