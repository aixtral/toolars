import { describe, expect, it, vi } from 'vitest';
import { createUsageMeterRuntimeRepository } from '@/lib/usage/runtime';

vi.mock('server-only', () => ({}));

describe('usage meter runtime repository factory', () => {
  it('falls back to preview usage repository outside production', async () => {
    const repository = await createUsageMeterRuntimeRepository({
      NODE_ENV: 'development',
    });

    expect(typeof repository.readUsageSnapshot).toBe('function');
  });

  it('fails closed in production when Supabase service env is missing', async () => {
    await expect(
      createUsageMeterRuntimeRepository({
        NODE_ENV: 'production',
      }),
    ).rejects.toThrow(/Missing Supabase usage database environment/);
  });

  it('creates the Supabase usage repository when env is configured', async () => {
    const repository = await createUsageMeterRuntimeRepository({
      NODE_ENV: 'production',
      NEXT_PUBLIC_SUPABASE_URL: 'https://toolars.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'publishable_test_key',
      SUPABASE_SERVICE_ROLE_KEY: 'service_role_secret',
    });

    expect(typeof repository.incrementAiGenerations).toBe('function');
  });
});
