import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RuleOf72Workspace } from "./rule-of-72-workspace";

export default function RuleOf72Page() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <RuleOf72Workspace />
    </ToolarsShell>
  );
}
