import { ToolarsShell } from "@/components/shell/toolars-shell";
import { AlcoholMetabolismWorkspace } from "./alcohol-metabolism-workspace";

export default function AlcoholMetabolismPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <AlcoholMetabolismWorkspace />
    </ToolarsShell>
  );
}
