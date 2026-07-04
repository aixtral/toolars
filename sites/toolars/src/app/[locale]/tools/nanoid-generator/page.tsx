import { ToolarsShell } from "@/components/shell/toolars-shell";
import { NanoidGeneratorWorkspace } from "./nanoid-generator-workspace";

export default function NanoidGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <NanoidGeneratorWorkspace />
    </ToolarsShell>
  );
}
