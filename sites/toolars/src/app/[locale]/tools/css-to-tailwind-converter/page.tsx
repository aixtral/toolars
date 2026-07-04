import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssToTailwindConverterWorkspace } from "./css-to-tailwind-converter-workspace";

export default function CssToTailwindConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CssToTailwindConverterWorkspace />
    </ToolarsShell>
  );
}
