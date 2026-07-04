import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CaseConverterWorkspace } from "./case-converter-workspace";

export default function CaseConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CaseConverterWorkspace />
    </ToolarsShell>
  );
}
