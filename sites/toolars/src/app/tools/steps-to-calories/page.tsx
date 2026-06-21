import { ToolarsShell } from "@/components/shell/toolars-shell";
import { StepsToCaloriesWorkspace } from "./steps-to-calories-workspace";

export default function StepsToCaloriesPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <StepsToCaloriesWorkspace />
    </ToolarsShell>
  );
}
