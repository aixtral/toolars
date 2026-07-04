import { ToolarsShell } from "@/components/shell/toolars-shell";
import { AiGuardrailConfigWorkspace } from "./ai-guardrail-config-workspace";

export default function AiGuardrailConfigPage() {
  return (
    <ToolarsShell active="ai-developer">
      <AiGuardrailConfigWorkspace />
    </ToolarsShell>
  );
}
