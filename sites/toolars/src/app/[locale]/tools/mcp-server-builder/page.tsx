import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { McpServerBuilderWorkspace } from "./mcp-server-builder-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("mcp-server-builder");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function McpServerBuilderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <McpServerBuilderWorkspace />
    </ToolarsShell>
  );
}
