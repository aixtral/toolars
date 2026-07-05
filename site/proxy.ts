import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

// Paths that are public regardless of auth status. Auth routes (/login,
// /register, /auth/*) are also public so logged-out visitors can reach them.
const PUBLIC_PATHS = [/^\/$/, /^\/tools/, /^\/ai/, /^\/blog/, /^\/categories/, /^\/login/, /^\/register/, /^\/auth\//];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((pattern) => pattern.test(pathname));
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export default async function middleware(request: NextRequest) {
  // 1. Refresh the Supabase session cookie on every request. Skip gracefully
  //    when Supabase env vars aren't configured (e.g. fresh checkout) so the
  //    public site keeps working without a configured auth backend.
  if (isSupabaseConfigured()) {
    await updateSession(request);
  }

  // 2. Run the next-intl locale middleware (handles /en, /zh, etc.).
  const handleI18n = createIntlMiddleware(routing);
  const intlResponse = await handleI18n(request);

  // 3. Auth guard for the workspace. /{locale}/app/* requires a session.
  //    Skip entirely when Supabase isn't configured (dev/CI without env):
  //    there's no real auth to protect, and the dev preview backdoor
  //    (`?preview=1`) is the only way in. That backdoor works at page level
  //    (lib/auth), so a middleware cookie check would incorrectly redirect
  //    before the page renders. When Supabase IS configured, the cookie guard
  //    runs normally.
  const { pathname } = request.nextUrl;
  const isAppRoute = /\/app(\/|$)/.test(pathname.replace(/^\/(en|zh|es|pt)/, ''));
  if (isSupabaseConfigured() && isAppRoute && !isPublicPath(pathname)) {
    // Check session by reading the supabase auth cookie presence. The real
    // check happens in-page via getSession(); middleware only does a fast
    // cookie-existence redirect to avoid a getUser() round-trip per request.
    const hasSessionCookie = request.cookies
      .getAll()
      .some((cookie) => cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token'));

    if (!hasSessionCookie) {
      // Detect locale from path for the redirect target.
      const localeMatch = pathname.match(/^\/(en|zh|es|pt)/);
      const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlResponse;
}

export const config = {
  // Match all pathnames except API routes, Next.js internals, and static assets.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
