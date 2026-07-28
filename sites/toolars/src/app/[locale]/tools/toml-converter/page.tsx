import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { TomlConverterWorkspace } from "./toml-converter-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("toml-converter");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function TomlConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <TomlConverterWorkspace />
    </ToolarsShell>
  );
}
