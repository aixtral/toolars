import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CoastFireWorkspace } from "./coast-fire-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("coast-fire");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CoastFirePage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <CoastFireWorkspace />
    </ToolarsShell>
  );
}
