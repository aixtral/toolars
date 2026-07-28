import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssBoxShadowGeneratorWorkspace } from "./css-box-shadow-generator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("css-box-shadow-generator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CssBoxShadowGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CssBoxShadowGeneratorWorkspace />
    </ToolarsShell>
  );
}
