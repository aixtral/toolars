import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PregnancyDueDateWorkspace } from "./pregnancy-due-date-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("pregnancy-due-date");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function PregnancyDueDatePage() {
  return (
    <ToolarsShell active="explore">
      <PregnancyDueDateWorkspace />
    </ToolarsShell>
  );
}
