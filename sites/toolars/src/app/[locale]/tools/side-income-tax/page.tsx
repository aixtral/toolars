import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SideIncomeTaxWorkspace } from "./side-income-tax-workspace";

export default function SideIncomeTaxPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <SideIncomeTaxWorkspace />
    </ToolarsShell>
  );
}
