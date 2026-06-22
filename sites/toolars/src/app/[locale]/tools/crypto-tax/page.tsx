import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CryptoTaxWorkspace } from "./crypto-tax-workspace";

export default function CryptoTaxPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <CryptoTaxWorkspace />
    </ToolarsShell>
  );
}
