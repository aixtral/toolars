import { afterEach, describe, expect, it } from 'vitest';
import type { ToolarsSession } from '@/lib/auth';
import { readSecurityEvents, resetSecurityEvents } from '@/lib/security/events';
import { createBillingCheckoutHandler } from './route';

const session: ToolarsSession = {
  userId: 'user_123',
  email: 'founder@toolars.test',
  workspaceId: 'workspace_123',
  planId: 'free',
  role: 'owner',
  isAuthenticated: true,
};

function checkoutRequest(body: unknown = { planId: 'pro' }) {
  return new Request('http://127.0.0.1/api/billing/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function checkoutFormRequest(planId = 'pro') {
  const body = new URLSearchParams({ planId });
  return new Request('http://127.0.0.1/api/billing/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
}

describe('POST /api/billing/checkout', () => {
  afterEach(() => {
    resetSecurityEvents();
  });

  it('requires an authenticated workspace before checkout handoff', async () => {
    const handler = createBillingCheckoutHandler({
      resolveSession: async () => null,
    });

    const response = await handler(checkoutRequest());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: 'Account required for checkout.',
    });
    expect(readSecurityEvents()).toMatchObject([
      {
        route: '/api/billing/checkout',
        category: 'billing',
        action: 'missing_session',
        outcome: 'denied',
        status: 401,
      },
    ]);
  });

  it('fails closed when the paid plan checkout URL is not configured', async () => {
    const handler = createBillingCheckoutHandler({
      env: {},
      resolveSession: async () => session,
    });

    const response = await handler(checkoutRequest());

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: 'Pro checkout is not configured.',
    });
  });

  it('redirects to configured checkout URL with workspace context', async () => {
    const handler = createBillingCheckoutHandler({
      env: {
        TOOLARS_LEMONSQUEEZY_PRO_CHECKOUT_URL:
          'https://toolars.lemonsqueezy.com/checkout/buy/pro',
      },
      resolveSession: async () => session,
    });

    const response = await handler(checkoutRequest());
    const location = response.headers.get('location');

    expect(response.status).toBe(303);
    expect(location).toContain('https://toolars.lemonsqueezy.com/checkout/buy/pro');
    expect(location).toContain('checkout%5Bcustom%5D%5Bworkspace_id%5D=workspace_123');
    expect(location).toContain('checkout%5Bcustom%5D%5Buser_id%5D=user_123');
    expect(location).toContain('checkout%5Bemail%5D=founder%40toolars.test');
  });

  it('accepts form-encoded checkout submissions from billing UI forms', async () => {
    const handler = createBillingCheckoutHandler({
      env: {
        TOOLARS_LEMONSQUEEZY_PRO_CHECKOUT_URL:
          'https://toolars.lemonsqueezy.com/checkout/buy/pro',
      },
      resolveSession: async () => session,
    });

    const response = await handler(checkoutFormRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toContain(
      'checkout%5Bcustom%5D%5Bworkspace_id%5D=workspace_123',
    );
  });
});
