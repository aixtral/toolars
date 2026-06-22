import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CarLoanWorkspace } from "./car-loan-workspace";

export default function CarLoanPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <CarLoanWorkspace />
    </ToolarsShell>
  );
}
