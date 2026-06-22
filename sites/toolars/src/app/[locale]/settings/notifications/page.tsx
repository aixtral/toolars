import { ToolarsShell } from "@/components/shell/toolars-shell";
import { NotificationsSettingsView } from "./notifications-settings-view";

export default function NotificationsSettingsPage() {
  return (
    <ToolarsShell active="settings" sidebarActiveHref="/settings/notifications" sidebarVariant="settings">
      <NotificationsSettingsView />
    </ToolarsShell>
  );
}
