import { ToolarsShell } from "@/components/shell/toolars-shell";
import { IntermittentFastingWorkspace } from "./intermittent-fasting-workspace";

export default function IntermittentFastingPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <IntermittentFastingWorkspace />
    </ToolarsShell>
  );
}
