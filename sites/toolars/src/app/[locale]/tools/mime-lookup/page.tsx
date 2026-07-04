import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MimeLookupWorkspace } from "./mime-lookup-workspace";

export default function MimeLookupPage() {
  return (
    <ToolarsShell active="ai-developer">
      <MimeLookupWorkspace />
    </ToolarsShell>
  );
}
