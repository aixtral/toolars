import { ToolarsShell } from "@/components/shell/toolars-shell";
import { UrlParserWorkspace } from "./url-parser-workspace";

export default function UrlParserPage() {
  return (
    <ToolarsShell active="ai-developer">
      <UrlParserWorkspace />
    </ToolarsShell>
  );
}
