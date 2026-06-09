import { createServerClient } from '@supabase/ssr';
import type { CookieMethodsServer, CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireSupabasePublicEnv } from './env';

export type SupabaseServerCookieMethods = CookieMethodsServer;
export type ToolarsSupabaseSetCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function parseRequestCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return [];

  return cookieHeader
    .split(';')
    .map((cookie) => {
      const separatorIndex = cookie.indexOf('=');
      if (separatorIndex < 0) return null;

      const name = cookie.slice(0, separatorIndex).trim();
      const value = cookie.slice(separatorIndex + 1).trim();
      return name ? { name, value: decodeCookieValue(value) } : null;
    })
    .filter((cookie): cookie is { name: string; value: string } =>
      Boolean(cookie),
    );
}

export function createToolarsSupabaseServerClient(
  cookies: SupabaseServerCookieMethods,
): SupabaseClient {
  const env = requireSupabasePublicEnv();

  return createServerClient(env.url, env.publishableKey, {
    cookies,
  });
}

export function createToolarsSupabaseRequestClient(
  request: Request,
  onSetCookies?: (cookies: ToolarsSupabaseSetCookie[]) => void,
): SupabaseClient {
  return createToolarsSupabaseServerClient({
    getAll() {
      return parseRequestCookieHeader(request.headers.get('cookie'));
    },
    setAll(cookies) {
      onSetCookies?.(cookies);
    },
  });
}
