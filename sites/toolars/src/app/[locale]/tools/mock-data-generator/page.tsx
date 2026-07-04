import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MockDataGeneratorWorkspace } from "./mock-data-generator-workspace";

export default function MockDataGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <MockDataGeneratorWorkspace />
    </ToolarsShell>
  );
}
