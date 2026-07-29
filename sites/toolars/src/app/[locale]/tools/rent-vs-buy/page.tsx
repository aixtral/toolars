import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RentVsBuyWorkspace } from "./rent-vs-buy-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("rent-vs-buy");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function RentVsBuyPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <ToolWorkspaceJsonLd slug="rent-vs-buy" />
      <RentVsBuyWorkspace />
    </ToolarsShell>
  );
}
