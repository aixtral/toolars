import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TomlConverterWorkspace } from "./toml-converter-workspace";

export default function TomlConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <TomlConverterWorkspace />
    </ToolarsShell>
  );
}
