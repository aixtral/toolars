import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BurnoutAssessmentWorkspace } from "./burnout-assessment-workspace";

export default function BurnoutAssessmentPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <BurnoutAssessmentWorkspace />
    </ToolarsShell>
  );
}
