import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { HeartRateZoneWorkspace } from "./heart-rate-zone-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("heart-rate-zone");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function HeartRateZonePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <ToolWorkspaceJsonLd slug="heart-rate-zone" />
      <HeartRateZoneWorkspace />
    </ToolarsShell>
  );
}
