import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonRepairWorkspace } from "./json-repair-workspace";

export default function JsonRepairPage() {
  return (
    <ToolarsShell active="ai-developer">
      <JsonRepairWorkspace />
    </ToolarsShell>
  );
}
