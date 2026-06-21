import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HomaIrWorkspace } from "./homa-ir-workspace";

export default function HomaIrPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <HomaIrWorkspace />
    </ToolarsShell>
  );
}
