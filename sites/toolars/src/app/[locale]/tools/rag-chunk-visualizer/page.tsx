import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RagChunkVisualizerWorkspace } from "./rag-chunk-visualizer-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("rag-chunk-visualizer");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function RagChunkVisualizerPage() {
  return (
    <ToolarsShell active="ai-developer">
      <RagChunkVisualizerWorkspace />
    </ToolarsShell>
  );
}
