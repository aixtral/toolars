import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ColorPaletteGeneratorWorkspace } from "./color-palette-generator-workspace";

export default function ColorPaletteGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ColorPaletteGeneratorWorkspace />
    </ToolarsShell>
  );
}
