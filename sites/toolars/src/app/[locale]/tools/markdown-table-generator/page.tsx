import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MarkdownTableGeneratorWorkspace } from "./markdown-table-generator-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("markdown-table-generator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function MarkdownTableGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="markdown-table-generator" />
      <MarkdownTableGeneratorWorkspace />
    </ToolarsShell>
  );
}
