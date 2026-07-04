import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HtmlEntityEncoderWorkspace } from "./html-entity-encoder-workspace";

export default function HtmlEntityEncoderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <HtmlEntityEncoderWorkspace />
    </ToolarsShell>
  );
}
