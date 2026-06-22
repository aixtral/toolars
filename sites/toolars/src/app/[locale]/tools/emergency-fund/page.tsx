import { ToolarsShell } from "@/components/shell/toolars-shell";
import { EmergencyFundWorkspace } from "./emergency-fund-workspace";

export default function EmergencyFundPage() {
  return (
    <ToolarsShell active="explore">
      <EmergencyFundWorkspace />
    </ToolarsShell>
  );
}
