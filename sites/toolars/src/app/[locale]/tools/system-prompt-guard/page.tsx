import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SystemPromptGuardWorkspace } from "./system-prompt-guard-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("system-prompt-guard");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function SystemPromptGuardPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="system-prompt-guard" />
      <SystemPromptGuardWorkspace />
    </ToolarsShell>
  );
}
