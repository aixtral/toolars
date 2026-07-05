import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPreviewSessionFromSearchParams, previewAuthEnabled } from '@/lib/auth';

// Mock the Supabase server client so getSession() doesn't require a real project.
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: vi.fn(async () => ({ data: { user: null } })),
    },
  })),
}));

describe('preview auth backdoor (dev-only)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns null when no account context is present', () => {
    expect(getPreviewSessionFromSearchParams({})).toBeNull();
  });

  it('maps preview query values to plan-aware sessions in dev', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(getPreviewSessionFromSearchParams({ preview: 'free' })).toMatchObject({
      userId: 'preview-free-user',
      planId: 'free',
      isAuthenticated: true,
    });
    expect(getPreviewSessionFromSearchParams({ preview: '1' })).toMatchObject({
      planId: 'pro',
    });
  });

  it('disables the preview backdoor in production unless explicitly enabled', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('TOOLARS_ENABLE_PREVIEW_AUTH', '');

    expect(previewAuthEnabled()).toBe(false);
    expect(getPreviewSessionFromSearchParams({ preview: 'pro' })).toBeNull();

    vi.stubEnv('TOOLARS_ENABLE_PREVIEW_AUTH', 'true');
    expect(previewAuthEnabled()).toBe(true);
    expect(getPreviewSessionFromSearchParams({ preview: 'pro' })).toMatchObject({
      planId: 'pro',
    });
  });
});

describe('getSession', () => {
  it('returns null when Supabase has no user', async () => {
    const { getSession } = await import('@/lib/auth');
    const session = await getSession();
    expect(session).toBeNull();
  });
});
