import { ToolarsShell } from "@/components/shell/toolars-shell";
import { XmlFormatterWorkspace } from "./xml-formatter-workspace";

export default function XmlFormatterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <XmlFormatterWorkspace />
    </ToolarsShell>
  );
}
