import { getToolBySlug } from "@/data/registry";
import { buildBreadcrumbSchema, buildGraph, buildWebApplicationSchema } from "@/lib/seo/json-ld";
import { getSiteBaseUrl } from "@/lib/seo/site-config";
import { JsonLd } from "./json-ld";

/**
 * schema.org structured data for a dedicated tool workspace page:
 * WebApplication (what the tool is, free) plus BreadcrumbList (site structure).
 * Server-rendered so crawlers and AI engines read it without executing JS.
 */
export function ToolWorkspaceJsonLd({ slug }: { slug: string }) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const baseUrl = getSiteBaseUrl();
  const explorePath = tool.group === "AI Developer Lab" ? "/explore/ai-developer" : "/explore/pdf";

  return (
    <JsonLd
      schema={buildGraph(
        buildWebApplicationSchema(tool, baseUrl),
        buildBreadcrumbSchema(
          [
            { name: "Tools", path: "/tools" },
            { name: tool.category, path: explorePath },
            { name: tool.name, path: tool.href }
          ],
          baseUrl
        )
      )}
    />
  );
}
