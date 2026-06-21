import { ToolarsShell } from "@/components/shell/toolars-shell";
import { StorageSettingsView } from "./storage-settings-view";

export default function StorageSettingsPage() {
  return (
    <ToolarsShell active="settings" sidebarActiveHref="/settings/storage" sidebarVariant="settings">
      <StorageSettingsView />
    </ToolarsShell>
  );
}
