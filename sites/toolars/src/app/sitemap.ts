import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/seo/build-sitemap-entries";
import { LAUNCH_LOCALES, getAlternateLanguageLinks, localizePath } from "@/lib/i18n";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteBaseUrl();
  const lastModified = new Date();
  const entries = buildSitemapEntries(baseUrl);

  const routes: MetadataRoute.Sitemap = [];

  for (const entry of entries) {
    const path = extractPath(entry.url, baseUrl);
    const languages = Object.fromEntries(
      getAlternateLanguageLinks(path, baseUrl).map((link) => [link.hreflang, link.href])
    );

    // Emit one canonical sitemap entry per (path × locale) so every localized
    // URL (/en/..., /es/..., /zh/...) is discoverable, each declaring its
    // hreflang alternates.
    for (const locale of LAUNCH_LOCALES) {
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

function extractPath(absoluteUrl: string, baseUrl: string): string {
  try {
    return new URL(absoluteUrl).pathname;
  } catch {
    const normalizedBase = baseUrl.replace(/\/+$/g, "");
    return absoluteUrl.startsWith(normalizedBase) ? absoluteUrl.slice(normalizedBase.length) || "/" : absoluteUrl;
  }
}
