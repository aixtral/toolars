import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MarkdownTableGeneratorWorkspace } from "./markdown-table-generator-workspace";

export default function MarkdownTableGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <MarkdownTableGeneratorWorkspace />
    </ToolarsShell>
  );
}
