import type { Metadata } from "next";
import en from "../../../messages/en.json";
import es from "../../../messages/es.json";
import zhHans from "../../../messages/zh-hans.json";
import zhHant from "../../../messages/zh-hant.json";
import { DEFAULT_LOCALE, isLaunchLocale, localizePath, type LocaleCode } from "@/lib/i18n";

const messagesByLocale = {
  en,
  es,
  "zh-hans": zhHans,
  "zh-hant": zhHant
} as const;
type MetadataLocaleCode = keyof typeof messagesByLocale;

const pageMetadataFields = {
  workflows: {
    path: "/workflows",
    title: ["workflowsPage", "pageHeroTitle"],
    description: ["workflowsPage", "pageHeroCopy"]
  },
  collections: {
    path: "/collections",
    title: ["collectionsPage", "heroTitleDesktop"],
    description: ["collectionsPage", "heroCopyDesktop"]
  },
  myTools: {
    path: "/my-tools",
    title: ["myToolsDashboard", "hero", "title"],
    description: ["myToolsDashboard", "hero", "subtitle"],
    robots: { index: false, follow: false }
  },
  pdfDirectory: {
    path: "/explore/pdf",
    title: ["directories", "pdf", "heroTitle"],
    description: ["directories", "pdf", "heroSubtitle"]
  },
  aiDeveloper: {
    path: "/explore/ai-developer",
    title: ["directories", "aiDeveloper", "heroTitle"],
    description: ["directories", "aiDeveloper", "heroSubtitle"]
  },
  pricing: {
    path: "/pricing",
    title: ["pricing", "hero", "trialTitleDesktop"],
    description: ["pricing", "hero", "trialCopyDesktop"]
  }
} as const;

type PageMetadataKey = keyof typeof pageMetadataFields;
type MessageTree = Record<string, unknown>;

function resolveMetadataLocale(locale: string): MetadataLocaleCode {
  return isLaunchLocale(locale) && locale in messagesByLocale
    ? (locale as MetadataLocaleCode)
    : (DEFAULT_LOCALE as MetadataLocaleCode);
}

function readMessage(messages: MessageTree, path: readonly string[]): string {
  let cursor: unknown = messages;

  for (const segment of path) {
    if (!cursor || typeof cursor !== "object" || !(segment in cursor)) {
      return "";
    }
    cursor = (cursor as MessageTree)[segment];
  }

  return typeof cursor === "string" ? cursor : "";
}

export function getLocalizedSiteMetadataCopy(locale: string): {
  siteName: string;
  tagline: string;
  description: string;
} {
  const localeCode = resolveMetadataLocale(locale);
  const messages = messagesByLocale[localeCode] as MessageTree;

  return {
    siteName: readMessage(messages, ["common", "brandName"]) || "Toolars",
    tagline: readMessage(messages, ["common", "tagline"]) || "All tools. One workspace.",
    description:
      readMessage(messages, ["home", "heroDesktop", "subtitle"]) ||
      "Toolars unifies traditional calculators, AI tools, and repeatable workflows into one search-first workspace."
  };
}

export async function buildLocalizedPageMetadata({
  locale,
  page
}: {
  locale: string;
  page: PageMetadataKey;
}): Promise<Metadata> {
  const localeCode = resolveMetadataLocale(locale);
  const messages = messagesByLocale[localeCode] as MessageTree;
  const fields = pageMetadataFields[page];
  const title = readMessage(messages, fields.title);
  const description = readMessage(messages, fields.description);
  const canonical = localizePath(fields.path, localeCode);
  const robots = "robots" in fields ? fields.robots : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical
    },
    ...(robots ? { robots } : null)
  };
}
