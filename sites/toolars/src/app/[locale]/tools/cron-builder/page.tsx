import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CronBuilderWorkspace } from "./cron-builder-workspace";

export default function CronBuilderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CronBuilderWorkspace />
    </ToolarsShell>
  );
}
