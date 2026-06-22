import { ToolarsShell } from "@/components/shell/toolars-shell";
import { AdhdScreenerWorkspace } from "./adhd-screener-workspace";

export default function AdhdScreenerPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <AdhdScreenerWorkspace />
    </ToolarsShell>
  );
}
