import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonToCsvWorkspace } from "./json-to-csv-workspace";

export default function JsonToCsvPage() {
  return (
    <ToolarsShell active="ai-developer">
      <JsonToCsvWorkspace />
    </ToolarsShell>
  );
}
