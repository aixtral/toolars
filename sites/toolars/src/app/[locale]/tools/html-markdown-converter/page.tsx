import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HtmlMarkdownConverterWorkspace } from "./html-markdown-converter-workspace";

export default function HtmlMarkdownConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <HtmlMarkdownConverterWorkspace />
    </ToolarsShell>
  );
}
