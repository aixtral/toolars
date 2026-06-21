import { ToolarsShell } from "@/components/shell/toolars-shell";
import { DrinkCaloriesWorkspace } from "./drink-calories-workspace";

export default function DrinkCaloriesPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <DrinkCaloriesWorkspace />
    </ToolarsShell>
  );
}
