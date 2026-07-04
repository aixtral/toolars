import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HallucinationCheckerWorkspace } from "./hallucination-checker-workspace";

export default function HallucinationCheckerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <HallucinationCheckerWorkspace />
    </ToolarsShell>
  );
}
