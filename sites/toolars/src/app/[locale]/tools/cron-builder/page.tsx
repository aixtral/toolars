import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CronBuilderWorkspace } from "./cron-builder-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("cron-builder");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CronBuilderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CronBuilderWorkspace />
    </ToolarsShell>
  );
}
