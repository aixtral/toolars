import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createPreviewSession,
  getSessionFromRequest,
  getSessionFromSearchParams,
} from '@/lib/auth';

describe('auth preview sessions', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns null when no account context is present', () => {
    expect(getSessionFromSearchParams({})).toBeNull();
    expect(getSessionFromRequest(new Request('http://127.0.0.1/api'))).toBeNull();
  });

  it('maps preview query values to plan-aware sessions', () => {
    expect(getSessionFromSearchParams({ preview: 'free' })).toMatchObject({
      userId: 'preview-free-user',
      planId: 'free',
      isAuthenticated: true,
    });
    expect(getSessionFromSearchParams({ preview: '1' })).toMatchObject({
      planId: 'pro',
    });
  });

  it('reads preview account headers for route handlers', () => {
    const request = new Request('http://127.0.0.1/api', {
      headers: {
        'x-toolars-preview-user': 'true',
        'x-toolars-preview-plan': 'team',
      },
    });

    expect(getSessionFromRequest(request)).toEqual(createPreviewSession('team'));
  });

  it('does not trust preview sessions in production even when explicitly enabled', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('TOOLARS_ENABLE_PREVIEW_AUTH', 'true');

    const request = new Request('http://127.0.0.1/api', {
      headers: {
        'x-toolars-preview-user': 'true',
        'x-toolars-preview-plan': 'pro',
      },
    });

    expect(getSessionFromSearchParams({ preview: 'pro' })).toBeNull();
    expect(getSessionFromRequest(request)).toBeNull();
  });

  it('allows local preview sessions to be explicitly disabled', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('TOOLARS_ENABLE_PREVIEW_AUTH', 'false');

    const request = new Request('http://127.0.0.1/api', {
      headers: {
        'x-toolars-preview-user': 'true',
        'x-toolars-preview-plan': 'pro',
      },
    });

    expect(getSessionFromSearchParams({ preview: 'pro' })).toBeNull();
    expect(getSessionFromRequest(request)).toBeNull();
  });
});
