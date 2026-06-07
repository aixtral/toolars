'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireSupabasePublicEnv } from './env';

export function createToolarsSupabaseBrowserClient(): SupabaseClient {
  const env = requireSupabasePublicEnv();
  return createBrowserClient(env.url, env.publishableKey);
}
