import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireSupabaseServiceEnv } from './env';

export function createToolarsSupabaseServiceClient(): SupabaseClient {
  const env = requireSupabaseServiceEnv();

  return createClient(env.url, env.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
