import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CssAnimationGeneratorWorkspace } from "./css-animation-generator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("css-animation-generator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CssAnimationGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CssAnimationGeneratorWorkspace />
    </ToolarsShell>
  );
}
