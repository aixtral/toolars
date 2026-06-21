import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PricingView } from "./pricing-view";

export default function PricingPage() {
  return (
    <ToolarsShell active="pricing" sidebarVariant="billing">
      <PricingView />
    </ToolarsShell>
  );
}
