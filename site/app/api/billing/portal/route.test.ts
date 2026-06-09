import { afterEach, describe, expect, it } from 'vitest';
import type { ToolarsSession } from '@/lib/auth';
import {
  createInMemoryBillingRepository,
  type BillingSubscriptionRecord,
} from '@/lib/billing';
import { resetSecurityEvents } from '@/lib/security/events';
import { createBillingPortalHandler } from './route';

const session: ToolarsSession = {
  userId: 'user_123',
  email: 'founder@toolars.test',
  workspaceId: 'workspace_123',
  planId: 'pro',
  role: 'owner',
  isAuthenticated: true,
};

const subscription: BillingSubscriptionRecord = {
  provider: 'lemon_squeezy',
  providerSubscriptionId: 'sub_123',
  workspaceId: 'workspace_123',
  providerCustomerId: 'cust_123',
  providerProductId: 'product_123',
  providerVariantId: '100',
  planId: 'pro',
  providerStatus: 'active',
  accessState: 'paid',
  customerPortalUrl: 'https://toolars.lemonsqueezy.com/billing?signed=1',
  updatePaymentMethodUrl: 'https://toolars.lemonsqueezy.com/subscription/payment',
  lastProviderEventId: 'evt_123',
  updatedAt: '2026-06-09T00:00:00.000Z',
};

function portalRequest() {
  return new Request('http://127.0.0.1/api/billing/portal', {
    method: 'GET',
  });
}

describe('GET /api/billing/portal', () => {
  afterEach(() => {
    resetSecurityEvents();
  });

  it('redirects to the signed customer portal URL for the workspace subscription', async () => {
    const repository = createInMemoryBillingRepository();
    await repository.upsertSubscription(subscription);
    const handler = createBillingPortalHandler({
      repository,
      resolveSession: async () => session,
    });

    const response = await handler(portalRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe(
      'https://toolars.lemonsqueezy.com/billing?signed=1',
    );
  });

  it('falls back to the configured unsigned portal URL', async () => {
    const handler = createBillingPortalHandler({
      env: {
        TOOLARS_LEMONSQUEEZY_PORTAL_URL: 'https://toolars.lemonsqueezy.com/billing',
      },
      repository: createInMemoryBillingRepository(),
      resolveSession: async () => session,
    });

    const response = await handler(portalRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('https://toolars.lemonsqueezy.com/billing');
  });

  it('fails closed when no portal target is available', async () => {
    const handler = createBillingPortalHandler({
      repository: createInMemoryBillingRepository(),
      resolveSession: async () => session,
    });

    const response = await handler(portalRequest());

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: 'Billing portal is not available for this workspace.',
    });
  });
});
