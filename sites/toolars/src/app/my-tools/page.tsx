import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MyToolsDashboardView } from "./my-tools-dashboard-view";

export default function MyToolsPage() {
  return (
    <ToolarsShell active="my-tools" sidebarVariant="workspace">
      <MyToolsDashboardView />
    </ToolarsShell>
  );
}
