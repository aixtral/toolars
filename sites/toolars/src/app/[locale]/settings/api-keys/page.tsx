import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ApiKeysSettingsView } from "./api-keys-settings-view";

export default function ApiKeysSettingsPage() {
  return (
    <ToolarsShell active="settings" sidebarActiveHref="/settings/api-keys" sidebarVariant="settings">
      <ApiKeysSettingsView />
    </ToolarsShell>
  );
}
