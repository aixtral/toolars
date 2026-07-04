import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ToxicityScannerWorkspace } from "./toxicity-scanner-workspace";

export default function ToxicityScannerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToxicityScannerWorkspace />
    </ToolarsShell>
  );
}
