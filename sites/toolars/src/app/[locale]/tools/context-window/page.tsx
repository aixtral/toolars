import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ContextWindowWorkspace } from "./context-window-workspace";

export default function ContextWindowPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ContextWindowWorkspace />
    </ToolarsShell>
  );
}
