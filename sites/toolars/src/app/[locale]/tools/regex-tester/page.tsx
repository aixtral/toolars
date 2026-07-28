import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RegexTesterWorkspace } from "./regex-tester-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("regex-tester");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function RegexTesterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <RegexTesterWorkspace />
    </ToolarsShell>
  );
}
