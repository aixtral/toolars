import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JailbreakDetectorWorkspace } from "./jailbreak-detector-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("jailbreak-detector");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function JailbreakDetectorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <JailbreakDetectorWorkspace />
    </ToolarsShell>
  );
}
