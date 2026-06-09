import { getRedirectUrl } from 'next/experimental/testing/server';
import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { config, proxy } from './proxy';

type NextRequestInit = ConstructorParameters<typeof NextRequest>[1];

function request(path: string, init?: NextRequestInit) {
  return new NextRequest(new URL(path, 'http://localhost:9088'), init);
}

describe('app route proxy guard', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('matches only app routes through the Next.js proxy matcher', () => {
    expect(config.matcher).toBe('/app/:path*');
  });

  it('redirects anonymous app visitors to login with the original path', async () => {
    const response = await proxy(request('/app/settings?tab=billing'));
    const redirectUrl = new URL(getRedirectUrl(response) ?? '');

    expect(redirectUrl.pathname).toBe('/login');
    expect(redirectUrl.searchParams.get('next')).toBe('/app/settings?tab=billing');
  });

  it('allows preview query access in non-production and stores preview state for app navigation', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = await proxy(request('/app/repurpose?preview=pro'));

    expect(getRedirectUrl(response)).toBeNull();
    expect(response.cookies.get('toolars-preview-plan')?.value).toBe('pro');
  });

  it('allows sibling app pages when a preview session cookie exists', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = await proxy(
      request('/app/history', {
        headers: {
          cookie: 'toolars-preview-plan=pro',
        },
      }),
    );

    expect(getRedirectUrl(response)).toBeNull();
  });

  it('allows Supabase-authenticated app visitors in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const response = await proxy(
      request('/app/repurpose', {
        headers: {
          cookie: 'sb-toolars-auth-token=old-token',
        },
      }),
      {
        resolveSupabaseAppSession: async (_request, response) => {
          response.cookies.set({
            name: 'sb-toolars-auth-token',
            value: 'refreshed-token',
            path: '/',
            httpOnly: true,
          });
          return true;
        },
      },
    );

    expect(getRedirectUrl(response)).toBeNull();
    expect(response.cookies.get('sb-toolars-auth-token')?.value).toBe(
      'refreshed-token',
    );
  });

  it('does not trust preview query access in production by default', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('TOOLARS_ENABLE_PREVIEW_AUTH', '');

    const response = await proxy(request('/app/repurpose?preview=pro'));
    const redirectUrl = new URL(getRedirectUrl(response) ?? '');

    expect(redirectUrl.pathname).toBe('/login');
    expect(redirectUrl.searchParams.get('next')).toBe('/app/repurpose?preview=pro');
  });
});
