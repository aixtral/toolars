import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MortgageRefinanceCalculatorWorkspace } from "./mortgage-refinance-calculator-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("mortgage-refinance-calculator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function MortgageRefinanceCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <ToolWorkspaceJsonLd slug="mortgage-refinance-calculator" />
      <MortgageRefinanceCalculatorWorkspace />
    </ToolarsShell>
  );
}
