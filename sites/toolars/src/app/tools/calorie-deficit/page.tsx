import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CalorieDeficitWorkspace } from "./calorie-deficit-workspace";

export default function CalorieDeficitPage() {
  return (
    <ToolarsShell active="explore">
      <CalorieDeficitWorkspace />
    </ToolarsShell>
  );
}
