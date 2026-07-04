import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JwtDecoderWorkspace } from "./jwt-decoder-workspace";

export default function JwtDecoderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <JwtDecoderWorkspace />
    </ToolarsShell>
  );
}
