import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JwtDecoderWorkspace } from "./jwt-decoder-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("jwt-decoder");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function JwtDecoderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="jwt-decoder" />
      <JwtDecoderWorkspace />
    </ToolarsShell>
  );
}
