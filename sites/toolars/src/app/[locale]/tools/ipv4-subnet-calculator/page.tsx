import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Ipv4SubnetCalculatorWorkspace } from "./ipv4-subnet-calculator-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("ipv4-subnet-calculator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function Ipv4SubnetCalculatorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ToolWorkspaceJsonLd slug="ipv4-subnet-calculator" />
      <Ipv4SubnetCalculatorWorkspace />
    </ToolarsShell>
  );
}
