import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ColorPaletteGeneratorWorkspace } from "./color-palette-generator-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("color-palette-generator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function ColorPaletteGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="color-palette-generator" />
      <ColorPaletteGeneratorWorkspace />
    </ToolarsShell>
  );
}
