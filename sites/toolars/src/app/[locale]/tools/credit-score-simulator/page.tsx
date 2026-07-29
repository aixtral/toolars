import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CreditScoreSimulatorWorkspace } from "./credit-score-simulator-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("credit-score-simulator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CreditScoreSimulatorPage() {
  return (
    <ToolarsShell active="explore">
      <ToolWorkspaceJsonLd slug="credit-score-simulator" />
      <CreditScoreSimulatorWorkspace />
    </ToolarsShell>
  );
}
