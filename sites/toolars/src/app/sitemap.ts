import type { MetadataRoute } from "next";
import { buildSitemapEntries, type SitemapEntry } from "@/lib/seo/build-sitemap-entries";
import { LAUNCH_LOCALES, localizePath, type LocaleCode } from "@/lib/i18n";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteBaseUrl();
  const lastModified = new Date();
  const entries = buildSitemapEntries(baseUrl);

  const routes: MetadataRoute.Sitemap = [];

  for (const entry of entries) {
    const path = extractPath(entry.url, baseUrl);
    const publicLocales = getEntryLaunchLocales(entry);
    const languages = getEntryAlternateLanguages(path, baseUrl, publicLocales);

    // Emit one canonical sitemap entry per (path × locale) so every localized
    // URL (/en/..., /es/..., /zh/...) is discoverable, each declaring its
    // hreflang alternates.
    for (const locale of publicLocales) {
      routes.push({
        url: `${baseUrl.replace(/\/+$/, "")}${localizePath(path, locale.code)}`,
        lastModified,
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
        alternates: { languages }
      });
    }
  }

  return routes;
}

function getEntryLaunchLocales(entry: SitemapEntry): typeof LAUNCH_LOCALES {
  if (!entry.locales) return LAUNCH_LOCALES;
  return LAUNCH_LOCALES.filter((locale) => entry.locales?.includes(locale.code));
}

function getEntryAlternateLanguages(path: string, baseUrl: string, locales: typeof LAUNCH_LOCALES) {
  const normalizedBase = baseUrl.replace(/\/+$/g, "");
  const languages = Object.fromEntries(
    locales.map((locale) => [locale.hreflang, `${normalizedBase}${localizePath(path, locale.code as LocaleCode)}`])
  );
  const defaultLocale = locales.find((locale) => locale.default) ?? locales[0];

  if (defaultLocale) {
    languages["x-default"] = `${normalizedBase}${localizePath(path, defaultLocale.code as LocaleCode)}`;
  }

  return languages;
}

function extractPath(absoluteUrl: string, baseUrl: string): string {
  try {
    return new URL(absoluteUrl).pathname;
  } catch {
    const normalizedBase = baseUrl.replace(/\/+$/g, "");
    return absoluteUrl.startsWith(normalizedBase) ? absoluteUrl.slice(normalizedBase.length) || "/" : absoluteUrl;
  }
}
