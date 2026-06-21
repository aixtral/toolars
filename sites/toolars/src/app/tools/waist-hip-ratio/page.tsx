import { ToolarsShell } from "@/components/shell/toolars-shell";
import { WaistHipRatioWorkspace } from "./waist-hip-ratio-workspace";

export default function WaistHipRatioPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <WaistHipRatioWorkspace />
    </ToolarsShell>
  );
}
