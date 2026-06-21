import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BillingSettingsView } from "./billing-settings-view";

export default function BillingSettingsPage() {
  return (
    <ToolarsShell active="pricing" sidebarVariant="billing">
      <BillingSettingsView />
    </ToolarsShell>
  );
}
