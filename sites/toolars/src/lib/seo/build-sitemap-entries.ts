import { allArticleSlugs } from "@/data/blog";
import { collections, tools, workflows } from "@/data/registry";

export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

const STATIC_DIRECTORIES: Array<{ path: string; changeFrequency: SitemapEntry["changeFrequency"]; priority: number }> = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/explore/pdf", changeFrequency: "weekly", priority: 0.9 },
  { path: "/explore/ai-developer", changeFrequency: "weekly", priority: 0.9 },
  { path: "/workflows", changeFrequency: "weekly", priority: 0.8 },
  { path: "/collections", changeFrequency: "weekly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/data-rights", changeFrequency: "yearly", priority: 0.3 }
];

/**
 * Build the full list of public sitemap entries for the Toolars site.
 * Includes the homepage, directories, every tool workspace + about page,
 * every workflow, and every collection.
 */
export function buildSitemapEntries(baseUrl: string): SitemapEntry[] {
  const normalizedBase = baseUrl.replace(/\/+$/g, "");
  const entries: SitemapEntry[] = [];

  for (const directory of STATIC_DIRECTORIES) {
    entries.push({
      url: `${normalizedBase}${directory.path}`,
      changeFrequency: directory.changeFrequency,
      priority: directory.priority
    });
  }

  for (const tool of tools) {
    entries.push({
      url: `${normalizedBase}${tool.href}`,
      changeFrequency: "weekly",
      priority: 0.7
    });
    entries.push({
      url: `${normalizedBase}${tool.aboutHref}`,
      changeFrequency: "weekly",
      priority: 0.6
    });
  }

  for (const workflow of workflows) {
    entries.push({
      url: `${normalizedBase}${workflow.href}`,
      changeFrequency: "weekly",
      priority: 0.6
    });
  }

  for (const collection of collections) {
    entries.push({
      url: `${normalizedBase}${collection.href}`,
      changeFrequency: "weekly",
      priority: 0.6
    });
  }

  for (const slug of allArticleSlugs) {
    entries.push({
      url: `${normalizedBase}/blog/${slug}`,
      changeFrequency: "monthly",
      priority: 0.6
    });
  }

  return entries;
}
