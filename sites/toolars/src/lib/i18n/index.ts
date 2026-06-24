import { LOCALES, type LocaleCode, type LocaleDefinition } from "@/data/locales";

export type { LocaleCode, LocaleDefinition } from "@/data/locales";
export { LOCALES } from "@/data/locales";

export const DEFAULT_LOCALE: LocaleCode = LOCALES.find((locale) => locale.default)?.code ?? "en";
export const LAUNCH_LOCALES: LocaleDefinition[] = LOCALES.filter((locale) => locale.phase === "launch");
export const NON_DEFAULT_LOCALES: LocaleDefinition[] = LAUNCH_LOCALES.filter((locale) => !locale.default);

export function isValidLocale(code: string): code is LocaleCode {
  return LOCALES.some((locale) => locale.code === code);
}

export function isDefaultLocale(code: LocaleCode): boolean {
  return code === DEFAULT_LOCALE;
}

/**
 * Localize a path for a locale. The default locale keeps the path as-is;
 * non-default locales get a prefix (`/es/tools/...`, `/zh/tools/...`).
 */
export function localizePath(path: string, locale: LocaleCode): string {
  if (locale === DEFAULT_LOCALE) return path;
  const trimmed = path === "/" ? "" : path;
  return `/${locale}${trimmed}`;
}

export function localizeCurrentPathForLocale(pathname: string, targetLocale: LocaleCode): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const [firstSegment, ...restSegments] = normalizedPath.split("/").filter(Boolean);
  const unprefixedPath = firstSegment && isValidLocale(firstSegment) ? `/${restSegments.join("/")}` : normalizedPath;
  const safePath = unprefixedPath === "/" || unprefixedPath === "" ? "/" : unprefixedPath;
  return localizePath(safePath, targetLocale);
}

export interface AlternateLink {
  hreflang: string;
  href: string;
}

/**
 * Build hreflang alternate links for a path across all launch locales, plus an
 * `x-default` entry pointing to the default locale. Used in metadata
 * `alternates.languages` and in the multilingual sitemap.
 */
export function getAlternateLanguageLinks(path: string, baseUrl: string): AlternateLink[] {
  const normalizedBase = baseUrl.replace(/\/+$/g, "");
  const links: AlternateLink[] = LAUNCH_LOCALES.map((locale) => ({
    hreflang: locale.hreflang,
    href: `${normalizedBase}${localizePath(path, locale.code)}`
  }));

  const defaultLocale = LAUNCH_LOCALES.find((locale) => locale.default) ?? LAUNCH_LOCALES[0];
  links.push({
    hreflang: "x-default",
    href: `${normalizedBase}${localizePath(path, defaultLocale.code)}`
  });

  return links;
}
