import { ToolarsShell } from "@/components/shell/toolars-shell";
import { McpToolLaunchWorkflow } from "./mcp-tool-launch-workflow";

export default function McpToolLaunchWorkflowPage() {
  return (
    <ToolarsShell active="workflows" sidebarVariant="workflows">
      <McpToolLaunchWorkflow />
    </ToolarsShell>
  );
}
