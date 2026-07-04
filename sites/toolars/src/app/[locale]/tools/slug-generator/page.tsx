import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SlugGeneratorWorkspace } from "./slug-generator-workspace";

export default function SlugGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <SlugGeneratorWorkspace />
    </ToolarsShell>
  );
}
