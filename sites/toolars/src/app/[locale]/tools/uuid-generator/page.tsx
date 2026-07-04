import { ToolarsShell } from "@/components/shell/toolars-shell";
import { UUIDGeneratorWorkspace } from "./uuid-generator-workspace";

export default function UUIDGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <UUIDGeneratorWorkspace />
    </ToolarsShell>
  );
}
