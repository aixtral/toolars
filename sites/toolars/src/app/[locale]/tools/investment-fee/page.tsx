import { ToolarsShell } from "@/components/shell/toolars-shell";
import { InvestmentFeeWorkspace } from "./investment-fee-workspace";

export default function InvestmentFeePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <InvestmentFeeWorkspace />
    </ToolarsShell>
  );
}
