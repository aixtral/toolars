import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CurrencyConverterWorkspace } from "./currency-converter-workspace";

export default function CurrencyConverterPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <CurrencyConverterWorkspace />
    </ToolarsShell>
  );
}
