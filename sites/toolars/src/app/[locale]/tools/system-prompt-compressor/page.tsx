import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SystemPromptCompressorWorkspace } from "./system-prompt-compressor-workspace";

export default function SystemPromptCompressorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <SystemPromptCompressorWorkspace />
    </ToolarsShell>
  );
}
