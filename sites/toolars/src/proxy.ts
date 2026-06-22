import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LAUNCH_LOCALES, isValidLocale } from "@/lib/i18n";

/**
 * Detect the preferred locale from the Accept-Language header, falling back to
 * the default locale (en).
 */
function detectLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const headerLocales = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=");
      return { tag: tag.split("-")[0].toLowerCase(), quality: quality ? parseFloat(quality) : 1 };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of headerLocales) {
    if (isValidLocale(tag)) return tag;
  }
  return DEFAULT_LOCALE;
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
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.svg"
  ) {
    return NextResponse.next();
  }

  // Already has a locale prefix (e.g. /en/tools, /es/tools).
  for (const locale of LAUNCH_LOCALES) {
    if (pathname === `/${locale.code}` || pathname.startsWith(`/${locale.code}/`)) {
      // Stamp the locale for next-intl's request config (setRequestLocale is
      // unreliable in some Next 16 Turbopack builds; this header is the source
      // of truth that getRequestConfig falls back to).
      const response = NextResponse.next();
      response.headers.set("x-next-intl-locale", locale.code);
      return response;
    }
  }

  const detected = detectLocale(request.headers.get("accept-language"));
  const redirectUrl = new URL(`/${detected}${pathname === "/" ? "" : pathname}${search}`, request.url);
  const redirect = NextResponse.redirect(redirectUrl, 308);
  redirect.headers.set("x-next-intl-locale", detected);
  return redirect;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - Next internals (_next/static, _next/image)
     * - favicon
     */
    "/((?!_next/static|_next/image|favicon).*)"
  ]
};
