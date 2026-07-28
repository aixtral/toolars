import type { Metadata } from "next";
import en from "../../../messages/en.json";
import es from "../../../messages/es.json";
import zhHans from "../../../messages/zh-hans.json";
import zhHant from "../../../messages/zh-hant.json";
import type { ToolDefinition } from "@/data/registry";
import { DEFAULT_LOCALE, isLaunchLocale, localizePath, type LocaleCode } from "@/lib/i18n";

const messagesByLocale = {
  en,
  es,
  "zh-hans": zhHans,
  "zh-hant": zhHant
} as const;

type ToolMetadataLocale = keyof typeof messagesByLocale;
type ToolMessage = { description?: unknown; name?: unknown };

function resolveMetadataLocale(locale: string | undefined): ToolMetadataLocale {
  return locale && isLaunchLocale(locale) && locale in messagesByLocale
    ? (locale as ToolMetadataLocale)
    : (DEFAULT_LOCALE as ToolMetadataLocale);
}

function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

function getLocalizedToolName(tool: ToolDefinition, locale: ToolMetadataLocale): string {
  const messages = messagesByLocale[locale];
  const toolMessage = (messages.tools as Record<string, ToolMessage>)[tool.slug];

  return typeof toolMessage?.name === "string" ? toolMessage.name : tool.name;
}

function getLocalizedToolDescription(tool: ToolDefinition, locale: ToolMetadataLocale): string {
  const messages = messagesByLocale[locale];
  const toolMessage = (messages.tools as Record<string, ToolMessage>)[tool.slug];

  return typeof toolMessage?.description === "string" ? toolMessage.description : tool.description;
}

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

function buildToolRobots(tool: ToolDefinition): Metadata["robots"] {
  return tool.launchCertified ? undefined : { index: false, follow: false };
}

/**
 * Build Next.js Metadata for a tool workspace page (`/tools/[slug]`).
 * The title template in the root layout appends the brand name automatically.
 */
export function buildToolMetadata(tool: ToolDefinition, locale?: string): Metadata {
  const localeCode: LocaleCode = resolveMetadataLocale(locale);
  const name = getLocalizedToolName(tool, localeCode);
  const description = getLocalizedToolDescription(tool, localeCode);
  const canonical = localizePath(tool.href, localeCode);

  return {
    title: name,
    description,
    keywords: buildKeywords(tool),
    alternates: {
      canonical
    },
    robots: buildToolRobots(tool),
    openGraph: {
      type: "website",
      title: `${name} — Toolars`,
      description: buildOpenGraphDescription(tool),
      url: canonical
    },
    twitter: {
      card: "summary",
      title: `${name} — Toolars`,
      description: buildOpenGraphDescription(tool)
    }
  };
}

/**
 * Build Next.js Metadata for a tool about/overview page (`/tools/[slug]/about`).
 */
export function buildToolAboutMetadata(tool: ToolDefinition, locale?: string): Metadata {
  const localeCode: LocaleCode = resolveMetadataLocale(locale);
  const messages = messagesByLocale[localeCode];
  const copy = messages.toolDetail.seo;
  const name = getLocalizedToolName(tool, localeCode);
  const toolDescription = getLocalizedToolDescription(tool, localeCode);
  const title = interpolate(copy.title, { name, description: tool.description });
  const description = interpolate(copy.description, { name, description: toolDescription });
  const canonical = localizePath(tool.aboutHref, localeCode);

  return {
    title,
    description,
    keywords: buildKeywords(tool),
    alternates: {
      canonical
    },
    robots: buildToolRobots(tool),
    openGraph: {
      type: "article",
      title: `${title} — Toolars`,
      description,
      url: canonical
    }
  };
}
