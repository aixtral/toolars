import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PdfTranslatorWorkspace } from "./pdf-translator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("pdf-translator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function PdfTranslatorPage() {
  return (
    <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
      <PdfTranslatorWorkspace />
    </ToolarsShell>
  );
}
