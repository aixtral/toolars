import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { PasswordGeneratorWorkspace } from "./password-generator-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("password-generator");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function PasswordGeneratorPage() {
  return (
    <ToolarsShell active="ai-developer">
      <PasswordGeneratorWorkspace />
    </ToolarsShell>
  );
}
