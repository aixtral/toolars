import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HashGeneratorWorkspace } from "./hash-generator-workspace";

export default function HashGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <HashGeneratorWorkspace />
    </ToolarsShell>
  );
}
