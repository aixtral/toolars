import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HtmlMarkdownConverterWorkspace } from "./html-markdown-converter-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("html-markdown-converter");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function HtmlMarkdownConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="html-markdown-converter" />
      <HtmlMarkdownConverterWorkspace />
    </ToolarsShell>
  );
}
