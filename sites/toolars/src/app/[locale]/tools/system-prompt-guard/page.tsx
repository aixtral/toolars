import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SystemPromptGuardWorkspace } from "./system-prompt-guard-workspace";

export default function SystemPromptGuardPage() {
  return (
    <ToolarsShell active="ai-developer">
      <SystemPromptGuardWorkspace />
    </ToolarsShell>
  );
}
