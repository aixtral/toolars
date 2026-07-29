import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { FunctionCallBuilderWorkspace } from "./function-call-builder-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("function-call-builder");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function FunctionCallBuilderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="function-call-builder" />
      <FunctionCallBuilderWorkspace />
    </ToolarsShell>
  );
}
