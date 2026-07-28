import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MockDataGeneratorWorkspace } from "./mock-data-generator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("mock-data-generator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function MockDataGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <MockDataGeneratorWorkspace />
    </ToolarsShell>
  );
}
