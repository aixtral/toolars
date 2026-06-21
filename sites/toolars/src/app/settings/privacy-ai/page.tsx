import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PrivacyAiSettingsView } from "./privacy-ai-settings-view";

export default function PrivacyAiSettingsPage() {
  return (
    <ToolarsShell active="settings" sidebarActiveHref="/settings/privacy-ai" sidebarVariant="settings">
      <PrivacyAiSettingsView />
    </ToolarsShell>
  );
}
