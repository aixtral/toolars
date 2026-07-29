import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { XmlFormatterWorkspace } from "./xml-formatter-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("xml-formatter");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function XmlFormatterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="xml-formatter" />
      <XmlFormatterWorkspace />
    </ToolarsShell>
  );
}
