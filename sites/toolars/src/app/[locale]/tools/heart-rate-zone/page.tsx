import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HeartRateZoneWorkspace } from "./heart-rate-zone-workspace";

export default function HeartRateZonePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <HeartRateZoneWorkspace />
    </ToolarsShell>
  );
}
