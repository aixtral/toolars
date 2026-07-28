import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { DockerComposeConverterWorkspace } from "./docker-compose-converter-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("docker-compose-converter");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function DockerComposeConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <DockerComposeConverterWorkspace />
    </ToolarsShell>
  );
}
