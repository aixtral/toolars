import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BodyFatCalculatorWorkspace } from "./body-fat-calculator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("body-fat-calculator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function BodyFatCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <BodyFatCalculatorWorkspace />
    </ToolarsShell>
  );
}
