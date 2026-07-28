import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Glp1EligibilityWorkspace } from "./glp1-eligibility-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("glp1-eligibility");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function Glp1EligibilityPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <Glp1EligibilityWorkspace />
    </ToolarsShell>
  );
}
