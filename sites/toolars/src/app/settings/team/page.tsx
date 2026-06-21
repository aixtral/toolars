import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TeamSettingsView } from "./team-settings-view";

export default function TeamSettingsPage() {
  return (
    <ToolarsShell active="settings" sidebarActiveHref="/settings/team" sidebarVariant="settings">
      <TeamSettingsView />
    </ToolarsShell>
  );
}
