import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/seo/build-tool-metadata";
import { getToolBySlug } from "@/data/registry";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CertificateDecoderWorkspace } from "./certificate-decoder-workspace";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tool = getToolBySlug("certificate-decoder");
  return tool ? buildToolMetadata(tool, locale) : {};
}


export default function CertificateDecoderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CertificateDecoderWorkspace />
    </ToolarsShell>
  );
}
