import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SqlFormatterWorkspace } from "./sql-formatter-workspace";

export default function SqlFormatterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <SqlFormatterWorkspace />
    </ToolarsShell>
  );
}
