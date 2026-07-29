import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BillSplitCalculatorWorkspace } from "./bill-split-calculator-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("bill-split-calculator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function BillSplitCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <ToolWorkspaceJsonLd slug="bill-split-calculator" />
      <BillSplitCalculatorWorkspace />
    </ToolarsShell>
  );
}
