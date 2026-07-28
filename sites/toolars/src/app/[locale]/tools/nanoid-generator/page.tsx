import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { NanoidGeneratorWorkspace } from "./nanoid-generator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("nanoid-generator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function NanoidGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <NanoidGeneratorWorkspace />
    </ToolarsShell>
  );
}
