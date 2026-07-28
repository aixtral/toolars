import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RedTeamSimulatorWorkspace } from "./red-team-simulator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("red-team-simulator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function RedTeamSimulatorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <RedTeamSimulatorWorkspace />
    </ToolarsShell>
  );
}
