import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CreditCardAprWorkspace } from "./credit-card-apr-workspace";

export default function CreditCardAprPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <CreditCardAprWorkspace />
    </ToolarsShell>
  );
}
