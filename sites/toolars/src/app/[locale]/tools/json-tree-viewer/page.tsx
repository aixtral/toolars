import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonTreeViewerWorkspace } from "./json-tree-viewer-workspace";

export default function JsonTreeViewerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <JsonTreeViewerWorkspace />
    </ToolarsShell>
  );
}
