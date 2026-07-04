import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RegexTesterWorkspace } from "./regex-tester-workspace";

export default function RegexTesterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <RegexTesterWorkspace />
    </ToolarsShell>
  );
}
