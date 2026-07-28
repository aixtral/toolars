import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SipCalculatorWorkspace } from "./sip-calculator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("sip-calculator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function SipCalculatorPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <SipCalculatorWorkspace />
    </ToolarsShell>
  );
}
