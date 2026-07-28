import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { StockAverageWorkspace } from "./stock-average-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("stock-average");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function StockAveragePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <StockAverageWorkspace />
    </ToolarsShell>
  );
}
