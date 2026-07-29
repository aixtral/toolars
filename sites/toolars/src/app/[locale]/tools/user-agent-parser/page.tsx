import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { UserAgentParserWorkspace } from "./user-agent-parser-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("user-agent-parser");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function UserAgentParserPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="user-agent-parser" />
      <UserAgentParserWorkspace />
    </ToolarsShell>
  );
}
