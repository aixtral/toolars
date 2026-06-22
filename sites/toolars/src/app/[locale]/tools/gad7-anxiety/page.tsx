import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Gad7AnxietyWorkspace } from "./gad7-anxiety-workspace";

export default function Gad7AnxietyPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <Gad7AnxietyWorkspace />
    </ToolarsShell>
  );
}
