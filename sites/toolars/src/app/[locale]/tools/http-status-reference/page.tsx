import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HttpStatusReferenceWorkspace } from "./http-status-reference-workspace";

export default function HttpStatusReferencePage() {
  return (
    <ToolarsShell active="ai-developer">
      <HttpStatusReferenceWorkspace />
    </ToolarsShell>
  );
}
