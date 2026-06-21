import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Phq9DepressionWorkspace } from "./phq9-depression-workspace";

export default function Phq9DepressionPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <Phq9DepressionWorkspace />
    </ToolarsShell>
  );
}
