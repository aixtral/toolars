import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BloodPressureWorkspace } from "./blood-pressure-workspace";

export default function BloodPressurePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <BloodPressureWorkspace />
    </ToolarsShell>
  );
}
