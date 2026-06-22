import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PregnancyDueDateWorkspace } from "./pregnancy-due-date-workspace";

export default function PregnancyDueDatePage() {
  return (
    <ToolarsShell active="explore">
      <PregnancyDueDateWorkspace />
    </ToolarsShell>
  );
}
