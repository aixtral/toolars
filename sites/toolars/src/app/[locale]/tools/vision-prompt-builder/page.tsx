import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { VisionPromptBuilderWorkspace } from "./vision-prompt-builder-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("vision-prompt-builder");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function VisionPromptBuilderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <VisionPromptBuilderWorkspace />
    </ToolarsShell>
  );
}
