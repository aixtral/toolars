import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssGridGeneratorWorkspace } from "./css-grid-generator-workspace";

export default function CssGridGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CssGridGeneratorWorkspace />
    </ToolarsShell>
  );
}
