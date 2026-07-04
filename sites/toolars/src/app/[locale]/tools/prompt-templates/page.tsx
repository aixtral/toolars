import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PromptTemplatesWorkspace } from "./prompt-templates-workspace";

export default function PromptTemplatesPage() {
  return (
    <ToolarsShell active="ai-developer">
      <PromptTemplatesWorkspace />
    </ToolarsShell>
  );
}
