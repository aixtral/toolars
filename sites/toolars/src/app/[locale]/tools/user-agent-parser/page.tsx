import { ToolarsShell } from "@/components/shell/toolars-shell";
import { UserAgentParserWorkspace } from "./user-agent-parser-workspace";

export default function UserAgentParserPage() {
  return (
    <ToolarsShell active="ai-developer">
      <UserAgentParserWorkspace />
    </ToolarsShell>
  );
}
