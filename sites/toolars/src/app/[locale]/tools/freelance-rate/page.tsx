import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { FreelanceRateWorkspace } from "./freelance-rate-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("freelance-rate");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function FreelanceRatePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <FreelanceRateWorkspace />
    </ToolarsShell>
  );
}
