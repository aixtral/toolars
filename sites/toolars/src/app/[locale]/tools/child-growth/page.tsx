import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ChildGrowthWorkspace } from "./child-growth-workspace";

export default function ChildGrowthPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <ChildGrowthWorkspace />
    </ToolarsShell>
  );
}
