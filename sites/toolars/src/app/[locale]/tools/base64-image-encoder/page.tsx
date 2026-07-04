import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Base64ImageEncoderWorkspace } from "./base64-image-encoder-workspace";

export default function Base64ImageEncoderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <Base64ImageEncoderWorkspace />
    </ToolarsShell>
  );
}
