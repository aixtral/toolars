import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Gad7AnxietyWorkspace } from "./gad7-anxiety-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("gad7-anxiety");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function Gad7AnxietyPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <ToolWorkspaceJsonLd slug="gad7-anxiety" />
      <Gad7AnxietyWorkspace />
    </ToolarsShell>
  );
}
