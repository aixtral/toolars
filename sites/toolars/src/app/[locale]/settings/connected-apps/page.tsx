import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ConnectedAppsSettingsView } from "./connected-apps-settings-view";

export default function ConnectedAppsSettingsPage() {
  return (
    <ToolarsShell active="settings" sidebarActiveHref="/settings/connected-apps" sidebarVariant="settings">
      <ConnectedAppsSettingsView />
    </ToolarsShell>
  );
}
