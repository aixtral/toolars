import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Base64ConverterWorkspace } from "./base64-converter-workspace";

export default function Base64ConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <Base64ConverterWorkspace />
    </ToolarsShell>
  );
}
