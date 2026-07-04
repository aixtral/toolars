import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CronExplainerWorkspace } from "./cron-explainer-workspace";

export default function CronExplainerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CronExplainerWorkspace />
    </ToolarsShell>
  );
}
