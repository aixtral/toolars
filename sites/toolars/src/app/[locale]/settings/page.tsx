import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SettingsView } from "./settings-view";

export default function SettingsPage() {
  return (
    <ToolarsShell active="settings" sidebarVariant="settings">
      <SettingsView />
    </ToolarsShell>
  );
}
