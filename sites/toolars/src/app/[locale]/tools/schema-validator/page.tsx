import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SchemaValidatorWorkspace } from "./schema-validator-workspace";

export default function SchemaValidatorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <SchemaValidatorWorkspace />
    </ToolarsShell>
  );
}
