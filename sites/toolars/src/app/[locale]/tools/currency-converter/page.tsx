import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CurrencyConverterWorkspace } from "./currency-converter-workspace";
import { ToolWorkspaceJsonLd } from "@/components/seo/tool-workspace-json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("currency-converter");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CurrencyConverterPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <ToolWorkspaceJsonLd slug="currency-converter" />
      <CurrencyConverterWorkspace />
    </ToolarsShell>
  );
}
