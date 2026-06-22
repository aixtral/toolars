import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CompoundInterestWorkspace } from "./compound-interest-workspace";

export default function CompoundInterestPage() {
  return (
    <ToolarsShell active="explore">
      <CompoundInterestWorkspace />
    </ToolarsShell>
  );
}
