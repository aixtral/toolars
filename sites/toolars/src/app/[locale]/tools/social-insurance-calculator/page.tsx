import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SocialInsuranceCalculatorWorkspace } from "./social-insurance-calculator-workspace";

export default function SocialInsuranceCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <SocialInsuranceCalculatorWorkspace />
    </ToolarsShell>
  );
}
