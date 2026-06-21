import { ToolarsShell } from "@/components/shell/toolars-shell";
import { GlycemicLoadWorkspace } from "./glycemic-load-workspace";

export default function GlycemicLoadPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <GlycemicLoadWorkspace />
    </ToolarsShell>
  );
}
