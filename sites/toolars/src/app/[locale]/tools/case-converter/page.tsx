import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CaseConverterWorkspace } from "./case-converter-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("case-converter");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CaseConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CaseConverterWorkspace />
    </ToolarsShell>
  );
}
