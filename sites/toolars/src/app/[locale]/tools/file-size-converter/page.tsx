import { ToolarsShell } from "@/components/shell/toolars-shell";
import { FileSizeConverterWorkspace } from "./file-size-converter-workspace";

export default function FileSizeConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <FileSizeConverterWorkspace />
    </ToolarsShell>
  );
}
