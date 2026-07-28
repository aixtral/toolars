import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ImageResizerWorkspace } from "./image-resizer-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("image-resizer");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function ImageResizerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <ImageResizerWorkspace />
    </ToolarsShell>
  );
}
