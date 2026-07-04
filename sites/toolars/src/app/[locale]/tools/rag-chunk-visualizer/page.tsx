import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RagChunkVisualizerWorkspace } from "./rag-chunk-visualizer-workspace";

export default function RagChunkVisualizerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <RagChunkVisualizerWorkspace />
    </ToolarsShell>
  );
}
