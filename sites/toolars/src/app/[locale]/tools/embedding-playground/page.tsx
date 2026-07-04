import { ToolarsShell } from "@/components/shell/toolars-shell";
import { EmbeddingPlaygroundWorkspace } from "./embedding-playground-workspace";

export default function EmbeddingPlaygroundPage() {
  return (
    <ToolarsShell active="ai-developer">
      <EmbeddingPlaygroundWorkspace />
    </ToolarsShell>
  );
}
