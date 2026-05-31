import { describe, expect, it } from 'vitest';
import {
  createPreviewSession,
  getSessionFromRequest,
  getSessionFromSearchParams,
} from '@/lib/auth';

describe('auth preview sessions', () => {
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
});
