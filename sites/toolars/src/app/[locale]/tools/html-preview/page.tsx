import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HtmlPreviewWorkspace } from "./html-preview-workspace";

export default function HtmlPreviewPage() {
  return (
    <ToolarsShell active="ai-developer">
      <HtmlPreviewWorkspace />
    </ToolarsShell>
  );
}
