import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SmokeFreeWorkspace } from "./smoke-free-workspace";

export default function SmokeFreePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <SmokeFreeWorkspace />
    </ToolarsShell>
  );
}
