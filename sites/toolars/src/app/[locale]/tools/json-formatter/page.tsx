import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonFormatterWorkspace } from "./json-formatter-workspace";

export default function JsonFormatterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <JsonFormatterWorkspace />
    </ToolarsShell>
  );
}
