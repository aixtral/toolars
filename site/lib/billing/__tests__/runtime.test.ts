import { describe, expect, it, vi } from 'vitest';
import { createBillingWebhookRuntimeRepository } from '@/lib/billing/runtime';

vi.mock('server-only', () => ({}));

describe('billing webhook runtime repository factory', () => {
  it('falls back to preview repository outside production when Supabase env is missing', async () => {
    const repository = await createBillingWebhookRuntimeRepository({
      NODE_ENV: 'development',
    });

    expect(typeof repository.recordProviderEvent).toBe('function');
  });

  it('fails closed in production when Supabase service env is missing', async () => {
    await expect(
      createBillingWebhookRuntimeRepository({
        NODE_ENV: 'production',
      }),
    ).rejects.toThrow(/Missing Supabase billing database environment/);
  });

  it('creates the Supabase repository when public and service env are configured', async () => {
    const repository = await createBillingWebhookRuntimeRepository({
      NODE_ENV: 'production',
      NEXT_PUBLIC_SUPABASE_URL: 'https://toolars.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'publishable_test_key',
      SUPABASE_SERVICE_ROLE_KEY: 'service_role_secret',
    });

    expect(typeof repository.recordProviderEvent).toBe('function');
  });
});
