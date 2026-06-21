import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PromptInjectionScannerWorkspace } from "./prompt-injection-scanner-workspace";

export default function PromptInjectionScannerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <PromptInjectionScannerWorkspace />
    </ToolarsShell>
  );
}
