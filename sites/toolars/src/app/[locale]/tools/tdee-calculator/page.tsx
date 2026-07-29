import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TdeeCalculatorWorkspace } from "./tdee-calculator-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("tdee-calculator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function TdeeCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <ToolWorkspaceJsonLd slug="tdee-calculator" />
      <TdeeCalculatorWorkspace />
    </ToolarsShell>
  );
}
