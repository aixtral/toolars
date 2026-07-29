import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { UUIDGeneratorWorkspace } from "./uuid-generator-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("uuid-generator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function UUIDGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="uuid-generator" />
      <UUIDGeneratorWorkspace />
    </ToolarsShell>
  );
}
