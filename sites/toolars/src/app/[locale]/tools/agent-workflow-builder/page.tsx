import { ToolarsShell } from "@/components/shell/toolars-shell";
import { AgentWorkflowBuilderWorkspace } from "./agent-workflow-builder-workspace";

export default function AgentWorkflowBuilderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <AgentWorkflowBuilderWorkspace />
    </ToolarsShell>
  );
}
