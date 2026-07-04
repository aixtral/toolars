import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RagEvalBenchWorkspace } from "./rag-eval-bench-workspace";

export default function RagEvalBenchPage() {
  return (
    <ToolarsShell active="ai-developer">
      <RagEvalBenchWorkspace />
    </ToolarsShell>
  );
}
