import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HtmlEntityEncoderWorkspace } from "./html-entity-encoder-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("html-entity-encoder");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function HtmlEntityEncoderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <HtmlEntityEncoderWorkspace />
    </ToolarsShell>
  );
}
