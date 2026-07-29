import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { EmergencyFundWorkspace } from "./emergency-fund-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("emergency-fund");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function EmergencyFundPage() {
  return (
    <ToolarsShell active="explore">
      <ToolWorkspaceJsonLd slug="emergency-fund" />
      <EmergencyFundWorkspace />
    </ToolarsShell>
  );
}
