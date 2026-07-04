import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MetaTagGeneratorWorkspace } from "./meta-tag-generator-workspace";

export default function MetaTagGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <MetaTagGeneratorWorkspace />
    </ToolarsShell>
  );
}
