import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TextStatsWorkspace } from "./text-stats-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("text-stats");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function TextStatsPage() {
  return (
    <ToolarsShell active="ai-developer">
      <TextStatsWorkspace />
    </ToolarsShell>
  );
}
