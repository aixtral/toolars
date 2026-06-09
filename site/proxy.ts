import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const previewCookieName = 'toolars-preview-plan';
const previewCookieMaxAge = 60 * 60;

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

export function proxy(request: NextRequest) {
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

  return redirectToLogin(request);
}

export const config = {
  matcher: '/app/:path*',
};

