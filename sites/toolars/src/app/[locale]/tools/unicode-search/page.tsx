import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { UnicodeSearchWorkspace } from "./unicode-search-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("unicode-search");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function UnicodeSearchPage() {
  return (
    <ToolarsShell active="ai-developer">
      <UnicodeSearchWorkspace />
    </ToolarsShell>
  );
}
