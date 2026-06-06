import { unstable_doesProxyMatch, getRedirectUrl } from 'next/experimental/testing/server';
import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { config, proxy } from './proxy';

function request(path: string, init?: RequestInit) {
  return new NextRequest(new URL(path, 'http://localhost:9088'), init);
}

describe('app route proxy guard', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('matches app routes but not public calculator routes', () => {
    expect(
      unstable_doesProxyMatch({
        config,
        nextConfig: {},
        url: '/app/templates',
      }),
    ).toBe(true);
    expect(
      unstable_doesProxyMatch({
        config,
        nextConfig: {},
        url: '/tools/bmi-calculator',
      }),
    ).toBe(false);
  });

  it('redirects anonymous app visitors to login with the original path', () => {
    const response = proxy(request('/app/settings?tab=billing'));
    const redirectUrl = new URL(getRedirectUrl(response) ?? '');

    expect(redirectUrl.pathname).toBe('/login');
    expect(redirectUrl.searchParams.get('next')).toBe('/app/settings?tab=billing');
  });

  it('allows preview query access in non-production and stores preview state for app navigation', () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = proxy(request('/app/repurpose?preview=pro'));

    expect(getRedirectUrl(response)).toBeNull();
    expect(response.cookies.get('toolars-preview-plan')?.value).toBe('pro');
  });

  it('allows sibling app pages when a preview session cookie exists', () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = proxy(
      request('/app/history', {
        headers: {
          cookie: 'toolars-preview-plan=pro',
        },
      }),
    );

    expect(getRedirectUrl(response)).toBeNull();
  });

  it('does not trust preview query access in production by default', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('TOOLARS_ENABLE_PREVIEW_AUTH', '');

    const response = proxy(request('/app/repurpose?preview=pro'));
    const redirectUrl = new URL(getRedirectUrl(response) ?? '');

    expect(redirectUrl.pathname).toBe('/login');
    expect(redirectUrl.searchParams.get('next')).toBe('/app/repurpose?preview=pro');
  });
});

