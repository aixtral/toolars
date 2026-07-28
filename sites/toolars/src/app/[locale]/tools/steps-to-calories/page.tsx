import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { StepsToCaloriesWorkspace } from "./steps-to-calories-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("steps-to-calories");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function StepsToCaloriesPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <StepsToCaloriesWorkspace />
    </ToolarsShell>
  );
}
