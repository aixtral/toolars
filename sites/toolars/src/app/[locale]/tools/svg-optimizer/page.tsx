import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SvgOptimizerWorkspace } from "./svg-optimizer-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("svg-optimizer");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function SvgOptimizerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <SvgOptimizerWorkspace />
    </ToolarsShell>
  );
}
