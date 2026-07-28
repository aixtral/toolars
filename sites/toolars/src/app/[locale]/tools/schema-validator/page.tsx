import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SchemaValidatorWorkspace } from "./schema-validator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("schema-validator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function SchemaValidatorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <SchemaValidatorWorkspace />
    </ToolarsShell>
  );
}
