import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssToTailwindConverterWorkspace } from "./css-to-tailwind-converter-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("css-to-tailwind-converter");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CssToTailwindConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="css-to-tailwind-converter" />
      <CssToTailwindConverterWorkspace />
    </ToolarsShell>
  );
}
