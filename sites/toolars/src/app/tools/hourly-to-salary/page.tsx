import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HourlyToSalaryWorkspace } from "./hourly-to-salary-workspace";

export default function HourlyToSalaryPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <HourlyToSalaryWorkspace />
    </ToolarsShell>
  );
}
