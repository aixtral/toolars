import { ToolarsShell } from "@/components/shell/toolars-shell";
import { FreelanceRateWorkspace } from "./freelance-rate-workspace";

export default function FreelanceRatePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <FreelanceRateWorkspace />
    </ToolarsShell>
  );
}
