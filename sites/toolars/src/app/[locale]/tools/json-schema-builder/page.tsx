import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonSchemaBuilderWorkspace } from "./json-schema-builder-workspace";

export default function JsonSchemaBuilderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <JsonSchemaBuilderWorkspace />
    </ToolarsShell>
  );
}
