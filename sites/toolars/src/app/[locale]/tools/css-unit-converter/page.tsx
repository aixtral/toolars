import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssUnitConverterWorkspace } from "./css-unit-converter-workspace";

export default function CssUnitConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CssUnitConverterWorkspace />
    </ToolarsShell>
  );
}
