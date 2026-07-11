import { collections, launchCertifiedTools, workflows } from "@/data/registry";

export interface CommandResult {
  group: "Tools" | "Workflows" | "Collections";
  title: string;
  meta: string;
  slug: string;
  href: string;
  keywords: string[];
}

interface SearchCommandResultsOptions {
  limit?: number;
}

const index: CommandResult[] = [
  ...launchCertifiedTools.map((tool) => ({
    group: "Tools" as const,
    title: tool.name,
    meta: `${tool.category} · ${tool.processing.join(" / ")} · ${tool.pricing}`,
    slug: tool.slug,
    href: tool.href,
    keywords: [tool.name, tool.slug, tool.description, tool.category, tool.group, ...tool.tags]
  })),
  ...workflows.map((workflow) => ({
    group: "Workflows" as const,
    title: workflow.title,
    meta: `${workflow.steps.length} steps · ${workflow.estimatedMinutes} min`,
    slug: workflow.slug,
    href: workflow.href,
    keywords: [workflow.title, workflow.slug, workflow.description, workflow.category, ...workflow.steps]
  })),
  ...collections.map((collection) => ({
    group: "Collections" as const,
    title: collection.title,
    meta: `${collection.toolSlugs.length} tools · ${collection.visibility}`,
    slug: collection.slug,
    href: collection.href,
    keywords: [collection.title, collection.slug, collection.description, collection.curator, ...collection.tags]
  }))
];

function scoreResult(result: CommandResult, tokens: string[]): number {
  const title = result.title.toLowerCase();
  const slug = result.slug.toLowerCase();
  const haystack = result.keywords.join(" ").toLowerCase();

  if (!tokens.every((token) => haystack.includes(token))) return 0;

  let score = 10;
  for (const token of tokens) {
    if (title.startsWith(token)) score += 30;
    if (slug.startsWith(token)) score += 20;
    if (title.includes(token)) score += 12;
    if (slug.includes(token)) score += 8;
  }
  if (result.group === "Tools") score += 3;
  if (result.title === "JSON Repair") score += tokens.includes("json") ? 20 : 0;
  if (result.title === "Turn PDF into summary" && tokens.includes("pdf")) score += 16;
  return score;
}

export function searchCommandResults(query: string, options: SearchCommandResultsOptions = {}): CommandResult[] {
  const limit = Math.max(1, options.limit ?? 12);
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) return index.slice(0, 8);

  return index
    .map((result) => ({ result, score: scoreResult(result, tokens) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .map((item) => item.result)
    .slice(0, limit);
}
