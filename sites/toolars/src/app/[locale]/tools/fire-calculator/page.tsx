import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { FireCalculatorWorkspace } from "./fire-calculator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("fire-calculator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function FireCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <FireCalculatorWorkspace />
    </ToolarsShell>
  );
}
