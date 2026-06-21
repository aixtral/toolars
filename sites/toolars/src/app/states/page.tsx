import { ToolarsShell } from "@/components/shell/toolars-shell";
import { StatesBoardView } from "./states-board-view";

export default function StatesPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="none">
      <StatesBoardView />
    </ToolarsShell>
  );
}
