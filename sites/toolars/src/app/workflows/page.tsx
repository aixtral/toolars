import { ToolarsShell } from "@/components/shell/toolars-shell";
import { WorkflowsIndexView } from "./workflows-index-view";

export default function WorkflowsPage() {
  return (
    <ToolarsShell active="workflows" sidebarVariant="workflows">
      <WorkflowsIndexView />
    </ToolarsShell>
  );
}
