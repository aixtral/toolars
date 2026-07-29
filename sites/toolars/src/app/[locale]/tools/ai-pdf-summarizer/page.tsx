import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { AiPdfSummarizerWorkspace } from "./ai-pdf-summarizer-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("ai-pdf-summarizer");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function AiPdfSummarizerPage() {
  return (
    <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
      <ToolWorkspaceJsonLd slug="ai-pdf-summarizer" />
      <AiPdfSummarizerWorkspace />
    </ToolarsShell>
  );
}
