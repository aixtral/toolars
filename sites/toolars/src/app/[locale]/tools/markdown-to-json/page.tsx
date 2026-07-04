import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MarkdownToJsonWorkspace } from "./markdown-to-json-workspace";

export default function MarkdownToJsonPage() {
  return (
    <ToolarsShell active="ai-developer">
      <MarkdownToJsonWorkspace />
    </ToolarsShell>
  );
}
