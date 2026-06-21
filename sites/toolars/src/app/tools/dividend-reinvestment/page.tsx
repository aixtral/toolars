import { ToolarsShell } from "@/components/shell/toolars-shell";
import { DividendReinvestmentWorkspace } from "./dividend-reinvestment-workspace";

export default function DividendReinvestmentPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <DividendReinvestmentWorkspace />
    </ToolarsShell>
  );
}
