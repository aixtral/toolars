import { afterEach, describe, expect, it, vi } from 'vitest';

const createBrowserClient = vi.fn(() => ({ auth: {} }));

// Mock @supabase/ssr before importing the module under test so the browser
// client factory is a spy we can assert against.
vi.mock('@supabase/ssr', () => ({
  createBrowserClient,
}));

describe('browser supabase client', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    createBrowserClient.mockClear();
  });

  it('creates a client from NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key');

    const { createClient } = await import('@/lib/supabase/client');
    createClient();

    expect(createBrowserClient).toHaveBeenCalledTimes(1);
    expect(createBrowserClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon-key',
    );
  });
});
