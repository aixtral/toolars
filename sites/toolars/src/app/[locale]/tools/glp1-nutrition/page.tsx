import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Glp1NutritionWorkspace } from "./glp1-nutrition-workspace";

export default function Glp1NutritionPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <Glp1NutritionWorkspace />
    </ToolarsShell>
  );
}
