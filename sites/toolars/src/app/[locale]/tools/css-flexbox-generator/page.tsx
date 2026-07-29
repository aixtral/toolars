import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssFlexboxGeneratorWorkspace } from "./css-flexbox-generator-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("css-flexbox-generator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CssFlexboxGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="css-flexbox-generator" />
      <CssFlexboxGeneratorWorkspace />
    </ToolarsShell>
  );
}
