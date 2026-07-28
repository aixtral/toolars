import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HtmlPreviewWorkspace } from "./html-preview-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("html-preview");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function HtmlPreviewPage() {
  return (
    <ToolarsShell active="ai-developer">
      <HtmlPreviewWorkspace />
    </ToolarsShell>
  );
}
