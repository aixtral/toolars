import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BiologicalAgeWorkspace } from "./biological-age-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("biological-age");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function BiologicalAgePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <ToolWorkspaceJsonLd slug="biological-age" />
      <BiologicalAgeWorkspace />
    </ToolarsShell>
  );
}
