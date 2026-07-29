import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssBorderRadiusGeneratorWorkspace } from "./css-border-radius-generator-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("css-border-radius-generator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CssBorderRadiusGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="css-border-radius-generator" />
      <CssBorderRadiusGeneratorWorkspace />
    </ToolarsShell>
  );
}
