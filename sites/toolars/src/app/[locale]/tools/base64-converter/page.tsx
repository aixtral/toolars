import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { Base64ConverterWorkspace } from "./base64-converter-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("base64-converter");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function Base64ConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <Base64ConverterWorkspace />
    </ToolarsShell>
  );
}
