import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { BmrCalculatorWorkspace } from "./bmr-calculator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("bmr-calculator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function BmrCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <BmrCalculatorWorkspace />
    </ToolarsShell>
  );
}
