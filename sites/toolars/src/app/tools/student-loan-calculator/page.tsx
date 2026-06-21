import { ToolarsShell } from "@/components/shell/toolars-shell";
import { StudentLoanCalculatorWorkspace } from "./student-loan-calculator-workspace";

export default function StudentLoanCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <StudentLoanCalculatorWorkspace />
    </ToolarsShell>
  );
}
