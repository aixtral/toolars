import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TimestampConverterWorkspace } from "./timestamp-converter-workspace";

export default function TimestampConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <TimestampConverterWorkspace />
    </ToolarsShell>
  );
}
