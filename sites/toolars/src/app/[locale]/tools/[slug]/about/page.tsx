import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { allDetailSlugs, getToolDetailBySlug, type ToolDetailDefinition } from "@/data/tool-details";
import { buildToolAboutMetadata } from "@/lib/seo/build-tool-metadata";
import { buildBreadcrumbSchema, buildGraph, buildHowToSchema, buildWebApplicationSchema } from "@/lib/seo/json-ld";
import { getSiteBaseUrl } from "@/lib/seo/site-config";
import { ToolDetailView } from "./tool-detail-view";

export function generateStaticParams() {
  return allDetailSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale?: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const detail = getToolDetailBySlug(slug);
  if (!detail) return {};
  return buildToolAboutMetadata(detail.tool, locale);
}

export function getDetailShellActive(detail: ToolDetailDefinition): "ai-developer" | "explore" {
  return detail.tool.group === "AI Developer Lab" ? "ai-developer" : "explore";
}

export default async function ToolAboutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = getToolDetailBySlug(slug);

  if (!detail) notFound();

  const baseUrl = getSiteBaseUrl();
  const explorePath = detail.tool.group === "AI Developer Lab" ? "/explore/ai-developer" : "/explore/pdf";
  const schema = buildGraph(
    buildWebApplicationSchema(detail.tool, baseUrl),
    buildHowToSchema(detail, baseUrl),
    buildBreadcrumbSchema(
      [
        { name: "Tools", path: "/tools" },
        { name: detail.tool.category, path: explorePath },
        { name: detail.tool.name, path: detail.tool.aboutHref }
      ],
      baseUrl
    )
  );

  return (
    <>
      <JsonLd schema={schema} />
      <ToolarsShell active={getDetailShellActive(detail)}>
        <ToolDetailView detail={detail} />
      </ToolarsShell>
    </>
  );
}
