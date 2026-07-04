import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CodeMinifierWorkspace } from "./code-minifier-workspace";

export default function CodeMinifierPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CodeMinifierWorkspace />
    </ToolarsShell>
  );
}
