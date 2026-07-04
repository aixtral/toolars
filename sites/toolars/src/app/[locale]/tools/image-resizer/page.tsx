import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ImageResizerWorkspace } from "./image-resizer-workspace";

export default function ImageResizerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ImageResizerWorkspace />
    </ToolarsShell>
  );
}
