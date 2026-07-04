import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TokenCounterWorkspace } from "./token-counter-workspace";

export default function TokenCounterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <TokenCounterWorkspace />
    </ToolarsShell>
  );
}
