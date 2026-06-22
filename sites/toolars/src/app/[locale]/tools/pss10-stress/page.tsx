import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Pss10StressWorkspace } from "./pss10-stress-workspace";

export default function Pss10StressPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <Pss10StressWorkspace />
    </ToolarsShell>
  );
}
