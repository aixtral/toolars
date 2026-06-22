import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Glp1EligibilityWorkspace } from "./glp1-eligibility-workspace";

export default function Glp1EligibilityPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <Glp1EligibilityWorkspace />
    </ToolarsShell>
  );
}
