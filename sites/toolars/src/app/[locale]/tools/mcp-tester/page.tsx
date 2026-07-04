import { ToolarsShell } from "@/components/shell/toolars-shell";
import { McpTesterWorkspace } from "./mcp-tester-workspace";

export default function McpTesterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <McpTesterWorkspace />
    </ToolarsShell>
  );
}
