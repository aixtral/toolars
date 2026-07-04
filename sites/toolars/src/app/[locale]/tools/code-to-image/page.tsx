import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CodeToImageWorkspace } from "./code-to-image-workspace";

export default function CodeToImagePage() {
  return (
    <ToolarsShell active="ai-developer">
      <CodeToImageWorkspace />
    </ToolarsShell>
  );
}
