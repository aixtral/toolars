import { ToolarsShell } from "@/components/shell/toolars-shell";
import { requireToolarsPageUser } from "@/lib/auth/toolars-page-access";
import { SettingsView } from "./settings-view";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireToolarsPageUser(locale);

  return (
    <ToolarsShell active="settings" sidebarVariant="settings">
      <SettingsView />
    </ToolarsShell>
  );
}
