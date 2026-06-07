import { createServerClient } from '@supabase/ssr';
import type { CookieMethodsServer } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireSupabasePublicEnv } from './env';

export type SupabaseServerCookieMethods = CookieMethodsServer;

export function createToolarsSupabaseServerClient(
  cookies: SupabaseServerCookieMethods,
): SupabaseClient {
  const env = requireSupabasePublicEnv();

  return createServerClient(env.url, env.publishableKey, {
    cookies,
  });
}
