import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BiologicalAgeWorkspace } from "./biological-age-workspace";

export default function BiologicalAgePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <BiologicalAgeWorkspace />
    </ToolarsShell>
  );
}
