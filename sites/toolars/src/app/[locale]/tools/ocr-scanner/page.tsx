import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { OcrScannerWorkspace } from "./ocr-scanner-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("ocr-scanner");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function OcrScannerPage() {
  return (
    <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
      <OcrScannerWorkspace />
    </ToolarsShell>
  );
}
