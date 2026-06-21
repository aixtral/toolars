import { ToolarsShell } from "@/components/shell/toolars-shell";
import { LeanBodyMassWorkspace } from "./lean-body-mass-workspace";

export default function LeanBodyMassPage() {
  return (
    <ToolarsShell active="explore">
      <LeanBodyMassWorkspace />
    </ToolarsShell>
  );
}
