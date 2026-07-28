import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonDiffWorkspace } from "./json-diff-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("json-diff");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function JsonDiffPage() {
  return (
    <ToolarsShell active="ai-developer">
      <JsonDiffWorkspace />
    </ToolarsShell>
  );
}
