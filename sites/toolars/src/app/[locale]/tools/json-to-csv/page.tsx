import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonToCsvWorkspace } from "./json-to-csv-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("json-to-csv");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function JsonToCsvPage() {
  return (
    <ToolarsShell active="ai-developer">
      <JsonToCsvWorkspace />
    </ToolarsShell>
  );
}
