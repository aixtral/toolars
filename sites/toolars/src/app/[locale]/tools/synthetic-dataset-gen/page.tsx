import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SyntheticDatasetGenWorkspace } from "./synthetic-dataset-gen-workspace";

export default function SyntheticDatasetGenPage() {
  return (
    <ToolarsShell active="ai-developer">
      <SyntheticDatasetGenWorkspace />
    </ToolarsShell>
  );
}
