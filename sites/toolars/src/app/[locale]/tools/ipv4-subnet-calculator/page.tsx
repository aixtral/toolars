import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Ipv4SubnetCalculatorWorkspace } from "./ipv4-subnet-calculator-workspace";

export default function Ipv4SubnetCalculatorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <Ipv4SubnetCalculatorWorkspace />
    </ToolarsShell>
  );
}
