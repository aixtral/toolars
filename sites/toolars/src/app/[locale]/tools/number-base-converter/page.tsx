import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { NumberBaseConverterWorkspace } from "./number-base-converter-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("number-base-converter");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function NumberBaseConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="number-base-converter" />
      <NumberBaseConverterWorkspace />
    </ToolarsShell>
  );
}
