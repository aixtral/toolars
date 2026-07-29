import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonFormatterWorkspace } from "./json-formatter-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("json-formatter");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function JsonFormatterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="json-formatter" />
      <JsonFormatterWorkspace />
    </ToolarsShell>
  );
}
