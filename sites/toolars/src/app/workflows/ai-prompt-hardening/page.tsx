import { ToolarsShell } from "@/components/shell/toolars-shell";
import { AiPromptHardeningWorkflow } from "./ai-prompt-hardening-workflow";

export default function AiPromptHardeningWorkflowPage() {
  return (
    <ToolarsShell active="workflows" sidebarVariant="workflows">
      <AiPromptHardeningWorkflow />
    </ToolarsShell>
  );
}
