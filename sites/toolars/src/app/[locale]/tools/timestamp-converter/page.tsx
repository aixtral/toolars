import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TimestampConverterWorkspace } from "./timestamp-converter-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("timestamp-converter");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function TimestampConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="timestamp-converter" />
      <TimestampConverterWorkspace />
    </ToolarsShell>
  );
}
