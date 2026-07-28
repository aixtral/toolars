import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SyntheticDatasetGenWorkspace } from "./synthetic-dataset-gen-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("synthetic-dataset-gen");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function SyntheticDatasetGenPage() {
  return (
    <ToolarsShell active="ai-developer">
      <SyntheticDatasetGenWorkspace />
    </ToolarsShell>
  );
}
