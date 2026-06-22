import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SecuritySettingsView } from "./security-settings-view";

export default function SecuritySettingsPage() {
  return (
    <ToolarsShell active="settings" sidebarActiveHref="/settings/security" sidebarVariant="settings">
      <SecuritySettingsView />
    </ToolarsShell>
  );
}
