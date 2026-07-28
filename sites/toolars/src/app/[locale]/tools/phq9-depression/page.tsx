import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Phq9DepressionWorkspace } from "./phq9-depression-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("phq9-depression");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function Phq9DepressionPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <Phq9DepressionWorkspace />
    </ToolarsShell>
  );
}
