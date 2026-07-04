import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SyntheticDatasetGeneratorWorkspace } from "./synthetic-dataset-generator-workspace";

export default function SyntheticDatasetGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <SyntheticDatasetGeneratorWorkspace />
    </ToolarsShell>
  );
}
