import { ToolarsShell } from "@/components/shell/toolars-shell";
import { FunctionCallBuilderWorkspace } from "./function-call-builder-workspace";

export default function FunctionCallBuilderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <FunctionCallBuilderWorkspace />
    </ToolarsShell>
  );
}
