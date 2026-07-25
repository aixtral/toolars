import { NextResponse, type NextRequest } from "next/server";
import { isLaunchCertifiedToolSlug } from "@/data/tool-launch-certification";
import { DEFAULT_LOCALE, ROUTED_LOCALES, isLaunchLocale } from "@/lib/i18n";

const PREVIEW_TOOL_ROBOTS_HEADER = "noindex, nofollow";

/**
 * Detect the preferred locale from the Accept-Language header, falling back to
 * the default locale (en).
 */
export function detectLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const headerLocales = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=");
      const fullTag = tag.toLowerCase();
      // Map Chinese variants to Simplified/Traditional.
      const primary = fullTag.split("-")[0];
      let resolved = primary;
      if (primary === "zh") {
        const region = fullTag.split("-")[1];
        resolved = ["tw", "hk", "mo"].includes(region) ? "zh-hant" : "zh-hans";
      }
      return { tag: resolved, quality: quality ? parseFloat(quality) : 1 };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of headerLocales) {
    if (isLaunchLocale(tag)) return tag;
  }
  return DEFAULT_LOCALE;
}

export function isStaticAssetPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/brand/") ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/pdf-worker.min.mjs" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.svg"
  );
}

export function getLaunchCertificationRobotsHeader(pathname: string): string | null {
  const slug = getToolSlugFromPathname(pathname);
  if (!slug) return null;
  return isLaunchCertifiedToolSlug(slug) ? null : PREVIEW_TOOL_ROBOTS_HEADER;
}

export function isLaunchPublicToolPath(pathname: string): boolean {
  const slug = getToolSlugFromPathname(pathname);
  return !slug || isLaunchCertifiedToolSlug(slug);
}

function getToolSlugFromPathname(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  const startsWithLocale = ROUTED_LOCALES.some((locale) => locale.code === firstSegment);
  const toolsIndex = startsWithLocale ? 1 : 0;

  if (segments[toolsIndex] !== "tools") return null;
  const rawSlug = segments[toolsIndex + 1];
  if (!rawSlug) return null;

  try {
    return decodeURIComponent(rawSlug).toLowerCase();
  } catch {
    return rawSlug.toLowerCase();
  }
}

function getLocaleFromPathname(pathname: string): string | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return ROUTED_LOCALES.some((locale) => locale.code === firstSegment) ? firstSegment : null;
}

function applyLaunchCertificationHeaders(response: NextResponse, pathname: string): NextResponse {
  const robotsHeader = getLaunchCertificationRobotsHeader(pathname);
  if (robotsHeader) response.headers.set("x-robots-tag", robotsHeader);
  return response;
}

/**
 * Redirect requests without a locale prefix to the appropriate locale-prefixed
 * path. Keeps API routes, static assets, and already-prefixed paths untouched.
 * This lets pages keep their existing href="/tools/..." links while URLs still
 * resolve under /en/ /es/ /zh/.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip Next internals, API routes, and the manifest/robots/sitemap special files.
  if (isStaticAssetPath(pathname)) {
    return NextResponse.next();
  }

  if (!isLaunchPublicToolPath(pathname)) {
    const locale = getLocaleFromPathname(pathname) ?? detectLocale(request.headers.get("accept-language"));
    return NextResponse.rewrite(new URL(`/${locale}/__tool-unavailable__`, request.url));
  }

  // Already has a locale prefix (e.g. /en/tools, /es/tools).
  for (const locale of ROUTED_LOCALES) {
    if (pathname === `/${locale.code}` || pathname.startsWith(`/${locale.code}/`)) {
      // Stamp the locale for next-intl's request config (setRequestLocale is
      // unreliable in some Next 16 Turbopack builds; this header is the source
      // of truth that getRequestConfig falls back to).
      const response = NextResponse.next();
      response.headers.set("x-next-intl-locale", locale.code);
      return applyLaunchCertificationHeaders(response, pathname);
    }
  }

  const detected = detectLocale(request.headers.get("accept-language"));
  const redirectUrl = new URL(`/${detected}${pathname === "/" ? "" : pathname}${search}`, request.url);
  const redirect = NextResponse.redirect(redirectUrl, 308);
  redirect.headers.set("x-next-intl-locale", detected);
  return applyLaunchCertificationHeaders(redirect, pathname);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - Next internals (_next/static, _next/image)
     * - favicon
     * - public brand assets
     * - the pdf.js worker asset used for on-device text extraction
     */
    "/((?!_next/static|_next/image|favicon|brand|pdf-worker).*)"
  ]
};
