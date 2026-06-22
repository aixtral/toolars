import { ToolarsShell } from "@/components/shell/toolars-shell";
import { IncomeTaxWorkspace } from "./income-tax-workspace";

export default function IncomeTaxPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <IncomeTaxWorkspace />
    </ToolarsShell>
  );
}
