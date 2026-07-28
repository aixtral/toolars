import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { WaistHipRatioWorkspace } from "./waist-hip-ratio-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("waist-hip-ratio");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function WaistHipRatioPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <WaistHipRatioWorkspace />
    </ToolarsShell>
  );
}
