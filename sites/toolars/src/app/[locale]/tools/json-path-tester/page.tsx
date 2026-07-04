import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonPathTesterWorkspace } from "./json-path-tester-workspace";

export default function JsonPathTesterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <JsonPathTesterWorkspace />
    </ToolarsShell>
  );
}
