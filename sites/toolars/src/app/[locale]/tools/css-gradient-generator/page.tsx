import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssGradientGeneratorWorkspace } from "./css-gradient-generator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("css-gradient-generator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CssGradientGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CssGradientGeneratorWorkspace />
    </ToolarsShell>
  );
}
