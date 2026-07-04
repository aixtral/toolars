import { ToolarsShell } from "@/components/shell/toolars-shell";
import { UrlEncoderWorkspace } from "./url-encoder-workspace";

export default function UrlEncoderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <UrlEncoderWorkspace />
    </ToolarsShell>
  );
}
