import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CoastFireWorkspace } from "./coast-fire-workspace";

export default function CoastFirePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <CoastFireWorkspace />
    </ToolarsShell>
  );
}
