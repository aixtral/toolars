import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HabitCostWorkspace } from "./habit-cost-workspace";

export default function HabitCostPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <HabitCostWorkspace />
    </ToolarsShell>
  );
}
