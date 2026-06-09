import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readSupabasePublicEnv } from '@/lib/supabase/env';
import { createToolarsSupabaseServerClient } from '@/lib/supabase/server';

const previewCookieName = 'toolars-preview-plan';
const previewCookieMaxAge = 60 * 60;

export interface AppRouteProxyOptions {
  resolveSupabaseAppSession?: (
    request: NextRequest,
    response: NextResponse,
  ) => Promise<boolean>;
}

function previewAuthEnabled() {
  return (
    process.env.NODE_ENV !== 'production' ||
    process.env.TOOLARS_ENABLE_PREVIEW_AUTH === 'true'
  );
}

function previewPlanFromValue(value: string | null | undefined) {
  if (value === '1') return 'pro';
  if (value === 'free' || value === 'pro' || value === 'team') return value;
  return undefined;
}

function requestPathWithSearch(request: NextRequest) {
  return `${request.nextUrl.pathname}${request.nextUrl.search}`;
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', requestPathWithSearch(request));
  return NextResponse.redirect(loginUrl);
}

async function resolveSupabaseAppSession(
  request: NextRequest,
  response: NextResponse,
) {
  if (!readSupabasePublicEnv().configured) return false;

  try {
    const client = createToolarsSupabaseServerClient({
      getAll() {
        return request.cookies.getAll().map(({ name, value }) => ({
          name,
          value,
        }));
      },
      setAll(cookies, headers) {
        cookies.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set({
            name,
            value,
            ...options,
          });
        });
        Object.entries(headers).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    });
    const { data, error } = await client.auth.getUser();
    return Boolean(!error && data.user?.id);
  } catch {
    return false;
  }
}

export async function proxy(
  request: NextRequest,
  options: AppRouteProxyOptions = {},
) {
  const previewPlan = previewPlanFromValue(request.nextUrl.searchParams.get('preview'));
  const cookiePlan = previewPlanFromValue(request.cookies.get(previewCookieName)?.value);

  if (previewAuthEnabled() && (previewPlan || cookiePlan)) {
    const response = NextResponse.next();

    if (previewPlan) {
      response.cookies.set({
        name: previewCookieName,
        value: previewPlan,
        path: '/app',
        maxAge: previewCookieMaxAge,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return response;
  }

  const response = NextResponse.next();
  const hasSupabaseSession = await (
    options.resolveSupabaseAppSession ?? resolveSupabaseAppSession
  )(request, response);
  if (hasSupabaseSession) return response;

  return redirectToLogin(request);
}

export const config = {
  matcher: '/app/:path*',
};
