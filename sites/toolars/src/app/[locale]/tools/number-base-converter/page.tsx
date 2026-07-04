import { ToolarsShell } from "@/components/shell/toolars-shell";
import { NumberBaseConverterWorkspace } from "./number-base-converter-workspace";

export default function NumberBaseConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <NumberBaseConverterWorkspace />
    </ToolarsShell>
  );
}
