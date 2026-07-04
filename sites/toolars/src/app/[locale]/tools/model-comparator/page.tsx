import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ModelComparatorWorkspace } from "./model-comparator-workspace";

export default function ModelComparatorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ModelComparatorWorkspace />
    </ToolarsShell>
  );
}
