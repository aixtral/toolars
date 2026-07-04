import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ExtractTablesWorkspace } from "./extract-tables-workspace";

export default function ExtractTablesPage() {
  return (
    <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
      <ExtractTablesWorkspace />
    </ToolarsShell>
  );
}
