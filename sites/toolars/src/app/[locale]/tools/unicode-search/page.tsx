import { ToolarsShell } from "@/components/shell/toolars-shell";
import { UnicodeSearchWorkspace } from "./unicode-search-workspace";

export default function UnicodeSearchPage() {
  return (
    <ToolarsShell active="ai-developer">
      <UnicodeSearchWorkspace />
    </ToolarsShell>
  );
}
