import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { RagEvalBenchWorkspace } from "./rag-eval-bench-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("rag-eval-bench");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function RagEvalBenchPage() {
  return (
    <ToolarsShell active="ai-developer">
      <RagEvalBenchWorkspace />
    </ToolarsShell>
  );
}
