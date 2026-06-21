import { ToolarsShell } from "@/components/shell/toolars-shell";
import { UnitConverterWorkspace } from "./unit-converter-workspace";

export default function UnitConverterPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <UnitConverterWorkspace />
    </ToolarsShell>
  );
}
