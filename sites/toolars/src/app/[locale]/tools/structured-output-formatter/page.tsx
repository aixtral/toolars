import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { StructuredOutputFormatterWorkspace } from "./structured-output-formatter-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("structured-output-formatter");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function StructuredOutputFormatterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <StructuredOutputFormatterWorkspace />
    </ToolarsShell>
  );
}
