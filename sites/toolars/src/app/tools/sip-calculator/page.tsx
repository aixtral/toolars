import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SipCalculatorWorkspace } from "./sip-calculator-workspace";

export default function SipCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <SipCalculatorWorkspace />
    </ToolarsShell>
  );
}
