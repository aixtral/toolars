import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CsvToJsonWorkspace } from "./csv-to-json-workspace";

export default function CsvToJsonPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CsvToJsonWorkspace />
    </ToolarsShell>
  );
}
