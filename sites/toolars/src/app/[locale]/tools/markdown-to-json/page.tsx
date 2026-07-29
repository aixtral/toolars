import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MarkdownToJsonWorkspace } from "./markdown-to-json-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("markdown-to-json");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function MarkdownToJsonPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="markdown-to-json" />
      <MarkdownToJsonWorkspace />
    </ToolarsShell>
  );
}
