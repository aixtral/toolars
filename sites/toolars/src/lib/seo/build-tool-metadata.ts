import type { Metadata } from "next";
import type { ToolDefinition } from "@/data/registry";

function buildKeywords(tool: ToolDefinition): string[] {
  const keywords = new Set<string>();
  keywords.add(tool.name);
  if (tool.category) keywords.add(tool.category);
  for (const tag of tool.tags) {
    keywords.add(tag);
  }
  return Array.from(keywords);
}

function buildOpenGraphDescription(tool: ToolDefinition): string {
  const localNote = tool.processing.includes("local") ? " Runs locally in your browser — no upload, no account required." : "";
  return `${tool.description}${localNote}`;
}

/**
 * Build Next.js Metadata for a tool workspace page (`/tools/[slug]`).
 * The title template in the root layout appends the brand name automatically.
 */
export function buildToolMetadata(tool: ToolDefinition): Metadata {
  return {
    title: tool.name,
    description: tool.description,
    keywords: buildKeywords(tool),
    alternates: {
      canonical: tool.href
    },
    openGraph: {
      type: "website",
      title: `${tool.name} — Toolars`,
      description: buildOpenGraphDescription(tool),
      url: tool.href
    },
    twitter: {
      card: "summary",
      title: `${tool.name} — Toolars`,
      description: buildOpenGraphDescription(tool)
    }
  };
}

/**
 * Build Next.js Metadata for a tool about/overview page (`/tools/[slug]/about`).
 */
export function buildToolAboutMetadata(tool: ToolDefinition): Metadata {
  return {
    title: `${tool.name} overview`,
    description: `What ${tool.name} does, how it works, and when to use it. ${tool.description}`,
    keywords: buildKeywords(tool),
    alternates: {
      canonical: tool.aboutHref
    },
    openGraph: {
      type: "article",
      title: `${tool.name} overview — Toolars`,
      description: tool.description,
      url: tool.aboutHref
    }
  };
}
