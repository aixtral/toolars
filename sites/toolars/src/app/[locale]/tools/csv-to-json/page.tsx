import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CsvToJsonWorkspace } from "./csv-to-json-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("csv-to-json");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CsvToJsonPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CsvToJsonWorkspace />
    </ToolarsShell>
  );
}
