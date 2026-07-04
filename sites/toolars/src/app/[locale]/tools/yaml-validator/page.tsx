import { ToolarsShell } from "@/components/shell/toolars-shell";
import { YamlValidatorWorkspace } from "./yaml-validator-workspace";

export default function YamlValidatorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <YamlValidatorWorkspace />
    </ToolarsShell>
  );
}
