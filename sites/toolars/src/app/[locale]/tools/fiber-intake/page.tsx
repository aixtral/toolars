import { ToolarsShell } from "@/components/shell/toolars-shell";
import { FiberIntakeWorkspace } from "./fiber-intake-workspace";

export default function FiberIntakePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <FiberIntakeWorkspace />
    </ToolarsShell>
  );
}
