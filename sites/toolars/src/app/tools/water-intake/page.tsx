import { ToolarsShell } from "@/components/shell/toolars-shell";
import { WaterIntakeWorkspace } from "./water-intake-workspace";

export default function WaterIntakePage() {
  return (
    <ToolarsShell active="explore">
      <WaterIntakeWorkspace />
    </ToolarsShell>
  );
}
