import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CronExplainerWorkspace } from "./cron-explainer-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("cron-explainer");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CronExplainerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CronExplainerWorkspace />
    </ToolarsShell>
  );
}
