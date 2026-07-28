import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { WaterIntakeWorkspace } from "./water-intake-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("water-intake");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function WaterIntakePage() {
  return (
    <ToolarsShell active="explore">
      <WaterIntakeWorkspace />
    </ToolarsShell>
  );
}
