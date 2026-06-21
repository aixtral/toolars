import { ToolarsShell } from "@/components/shell/toolars-shell";
import { McpServerBuilderWorkspace } from "./mcp-server-builder-workspace";

export default function McpServerBuilderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <McpServerBuilderWorkspace />
    </ToolarsShell>
  );
}
