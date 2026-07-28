import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { InvestmentGoalWorkspace } from "./investment-goal-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("investment-goal");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function InvestmentGoalPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <InvestmentGoalWorkspace />
    </ToolarsShell>
  );
}
