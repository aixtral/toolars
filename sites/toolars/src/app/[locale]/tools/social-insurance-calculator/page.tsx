import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SocialInsuranceCalculatorWorkspace } from "./social-insurance-calculator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("social-insurance-calculator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function SocialInsuranceCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <SocialInsuranceCalculatorWorkspace />
    </ToolarsShell>
  );
}
