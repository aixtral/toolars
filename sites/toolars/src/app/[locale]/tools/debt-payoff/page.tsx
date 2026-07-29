import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { DebtPayoffWorkspace } from "./debt-payoff-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("debt-payoff");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function DebtPayoffPage() {
  return (
    <ToolarsShell active="explore">
      <ToolWorkspaceJsonLd slug="debt-payoff" />
      <DebtPayoffWorkspace />
    </ToolarsShell>
  );
}
