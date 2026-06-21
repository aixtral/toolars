import { ToolarsShell } from "@/components/shell/toolars-shell";
import { OneRepMaxWorkspace } from "./one-rep-max-workspace";

export default function OneRepMaxPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <OneRepMaxWorkspace />
    </ToolarsShell>
  );
}
