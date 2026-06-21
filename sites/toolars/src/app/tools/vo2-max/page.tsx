import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Vo2MaxWorkspace } from "./vo2-max-workspace";

export default function Vo2MaxPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <Vo2MaxWorkspace />
    </ToolarsShell>
  );
}
