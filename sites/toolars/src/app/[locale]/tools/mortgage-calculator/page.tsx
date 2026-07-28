import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { MortgageCalculatorWorkspace } from "./mortgage-calculator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("mortgage-calculator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function MortgageCalculatorPage() {
  return (
    <ToolarsShell active="explore">
      <MortgageCalculatorWorkspace />
    </ToolarsShell>
  );
}
