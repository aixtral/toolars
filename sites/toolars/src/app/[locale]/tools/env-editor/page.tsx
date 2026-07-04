import { ToolarsShell } from "@/components/shell/toolars-shell";
import { EnvEditorWorkspace } from "./env-editor-workspace";

export default function EnvEditorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <EnvEditorWorkspace />
    </ToolarsShell>
  );
}
