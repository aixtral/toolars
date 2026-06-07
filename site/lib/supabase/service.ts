import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireSupabaseServiceEnv } from './env';

type EnvRecord = Partial<Record<string, string | undefined>>;

export function createToolarsSupabaseServiceClient(
  runtimeEnv: EnvRecord = process.env,
): SupabaseClient {
  const env = requireSupabaseServiceEnv(runtimeEnv);

  return createClient(env.url, env.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
