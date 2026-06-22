import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ThirtyThirtyThirtyMethodWorkspace } from "./30-30-30-method-workspace";

export default function ThirtyThirtyThirtyMethodPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <ThirtyThirtyThirtyMethodWorkspace />
    </ToolarsShell>
  );
}
