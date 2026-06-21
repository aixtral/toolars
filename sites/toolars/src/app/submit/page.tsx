import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SubmitToolView } from "./submit-tool-view";

export default function SubmitPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="none">
      <SubmitToolView />
    </ToolarsShell>
  );
}
