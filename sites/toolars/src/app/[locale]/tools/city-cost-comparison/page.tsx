import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CityCostComparisonWorkspace } from "./city-cost-comparison-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("city-cost-comparison");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CityCostComparisonPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <CityCostComparisonWorkspace />
    </ToolarsShell>
  );
}
