import { describe, expect, it } from 'vitest';
import {
  readSupabasePublicEnv,
  requireSupabasePublicEnv,
  requireSupabaseServiceEnv,
} from '@/lib/supabase/env';

describe('Supabase environment boundaries', () => {
  it('returns browser-safe public Supabase configuration only', () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: 'https://toolars.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'publishable_test_key',
      SUPABASE_SERVICE_ROLE_KEY: 'service_role_secret',
    };

    expect(requireSupabasePublicEnv(env)).toEqual({
      url: 'https://toolars.supabase.co',
      publishableKey: 'publishable_test_key',
    });
    expect(JSON.stringify(requireSupabasePublicEnv(env))).not.toContain(
      'service_role_secret',
    );
  });

  it('reports missing public Supabase env without exposing secret keys', () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '',
      SUPABASE_SERVICE_ROLE_KEY: 'service_role_secret',
    };

    expect(readSupabasePublicEnv(env)).toEqual({
      configured: false,
      missing: [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
      ],
    });
    expect(() => requireSupabasePublicEnv(env)).toThrow(
      /Missing Supabase public environment/,
    );
  });

  it('requires the service role key through a server-only env helper', () => {
    expect(
      requireSupabaseServiceEnv({
        NEXT_PUBLIC_SUPABASE_URL: 'https://toolars.supabase.co',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'publishable_test_key',
        SUPABASE_SERVICE_ROLE_KEY: 'service_role_secret',
      }),
    ).toEqual({
      url: 'https://toolars.supabase.co',
      serviceRoleKey: 'service_role_secret',
    });

    expect(() =>
      requireSupabaseServiceEnv({
        NEXT_PUBLIC_SUPABASE_URL: 'https://toolars.supabase.co',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'publishable_test_key',
      }),
    ).toThrow(/Missing Supabase service role key/);
  });
});
