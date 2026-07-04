import { ToolarsShell } from "@/components/shell/toolars-shell";
import { StructuredOutputFormatterWorkspace } from "./structured-output-formatter-workspace";

export default function StructuredOutputFormatterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <StructuredOutputFormatterWorkspace />
    </ToolarsShell>
  );
}
