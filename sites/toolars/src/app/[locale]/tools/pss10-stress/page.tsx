import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Pss10StressWorkspace } from "./pss10-stress-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("pss10-stress");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function Pss10StressPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <Pss10StressWorkspace />
    </ToolarsShell>
  );
}
