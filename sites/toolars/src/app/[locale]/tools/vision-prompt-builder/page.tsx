import { ToolarsShell } from "@/components/shell/toolars-shell";
import { VisionPromptBuilderWorkspace } from "./vision-prompt-builder-workspace";

export default function VisionPromptBuilderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <VisionPromptBuilderWorkspace />
    </ToolarsShell>
  );
}
