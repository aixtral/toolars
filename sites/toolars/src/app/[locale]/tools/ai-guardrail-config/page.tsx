import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { AiGuardrailConfigWorkspace } from "./ai-guardrail-config-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("ai-guardrail-config");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function AiGuardrailConfigPage() {
  return (
    <ToolarsShell active="ai-developer">
      <AiGuardrailConfigWorkspace />
    </ToolarsShell>
  );
}
