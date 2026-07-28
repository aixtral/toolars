import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { UnitConverterWorkspace } from "./unit-converter-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("unit-converter");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function UnitConverterPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="tools">
      <UnitConverterWorkspace />
    </ToolarsShell>
  );
}
