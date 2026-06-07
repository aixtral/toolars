import { describe, expect, it } from 'vitest';
import {
  createInMemoryBillingRepository,
  createLemonSqueezyWebhookSignature,
  mapLemonSqueezyStatusToAccessState,
  parseLemonSqueezySubscriptionEvent,
  processBillingSubscriptionEvent,
  verifyLemonSqueezyWebhookSignature,
} from '@/lib/billing';

const variantPlanMap = new Map([
  ['100', 'pro' as const],
  ['200', 'team' as const],
]);

function subscriptionPayload({
  eventName = 'subscription_created',
  status = 'active',
  variantId = 100,
  updatedAt = '2026-06-06T12:00:00.000000Z',
}: {
  eventName?: string;
  status?: string;
  variantId?: number;
  updatedAt?: string;
} = {}) {
  return JSON.stringify({
    meta: {
      event_name: eventName,
      custom_data: {
        workspace_id: 'workspace_123',
      },
    },
    data: {
      type: 'subscriptions',
      id: 'sub_123',
      attributes: {
        customer_id: 42,
        product_id: 900,
        variant_id: variantId,
        status,
        renews_at: '2026-07-06T12:00:00.000000Z',
        ends_at: status === 'cancelled' ? '2026-07-06T12:00:00.000000Z' : null,
        trial_ends_at: null,
        updated_at: updatedAt,
        urls: {
          customer_portal: 'https://billing.example/customer',
          update_payment_method: 'https://billing.example/payment',
        },
      },
    },
  });
}

describe('Lemon Squeezy billing helpers', () => {
  it('verifies raw-body X-Signature values without preview timestamps', () => {
    const body = subscriptionPayload();
    const secret = 'lemon_test_secret';
    const signature = createLemonSqueezyWebhookSignature({ body, secret });

    expect(verifyLemonSqueezyWebhookSignature({ body, secret, signature })).toBe(true);
    expect(
      verifyLemonSqueezyWebhookSignature({
        body,
        secret,
        signature: 'toolars-preview-signature',
      }),
    ).toBe(false);
  });

  it('parses subscription resources and maps provider variants server-side', () => {
    const body = subscriptionPayload();

    expect(
      parseLemonSqueezySubscriptionEvent({
        body,
        eventName: 'subscription_created',
        variantPlanMap,
      }),
    ).toMatchObject({
      eventName: 'subscription_created',
      providerObjectId: 'sub_123',
      workspaceId: 'workspace_123',
      planId: 'pro',
      providerStatus: 'active',
      accessState: 'paid',
      customerPortalUrl: 'https://billing.example/customer',
      updatePaymentMethodUrl: 'https://billing.example/payment',
    });
  });

  it('records unknown variants as failed events without subscription mutation', async () => {
    const body = subscriptionPayload({ variantId: 404 });
    const event = parseLemonSqueezySubscriptionEvent({
      body,
      eventName: 'subscription_created',
      variantPlanMap,
    });
    const repository = createInMemoryBillingRepository();

    const result = await processBillingSubscriptionEvent({ event, repository });

    expect(result).toMatchObject({
      accepted: false,
      duplicate: false,
      error: 'Unknown Lemon Squeezy subscription variant.',
    });
    expect(repository.listEvents()).toHaveLength(1);
    expect(repository.listSubscriptions()).toHaveLength(0);
  });

  it('maps provider subscription statuses to explicit Toolars access states', () => {
    expect(mapLemonSqueezyStatusToAccessState('active')).toBe('paid');
    expect(mapLemonSqueezyStatusToAccessState('on_trial')).toBe('paid');
    expect(mapLemonSqueezyStatusToAccessState('past_due')).toBe('grace');
    expect(mapLemonSqueezyStatusToAccessState('paused')).toBe('paused');
    expect(mapLemonSqueezyStatusToAccessState('cancelled')).toBe('paid_until_end');
    expect(mapLemonSqueezyStatusToAccessState('unpaid')).toBe('free');
    expect(mapLemonSqueezyStatusToAccessState('expired')).toBe('free');
  });

  it('processes duplicate provider events idempotently', async () => {
    const event = parseLemonSqueezySubscriptionEvent({
      body: subscriptionPayload({ eventName: 'subscription_updated' }),
      eventName: 'subscription_updated',
      variantPlanMap,
    });
    const repository = createInMemoryBillingRepository();

    const first = await processBillingSubscriptionEvent({ event, repository });
    const second = await processBillingSubscriptionEvent({ event, repository });

    expect(first).toMatchObject({
      accepted: true,
      duplicate: false,
      planId: 'pro',
      accessState: 'paid',
    });
    expect(second).toMatchObject({
      accepted: true,
      duplicate: true,
      planId: 'pro',
      accessState: 'paid',
    });
    expect(repository.listEvents()).toHaveLength(1);
    expect(repository.listSubscriptions()).toHaveLength(1);
  });

  it('falls back to free access for expired paid variants', async () => {
    const event = parseLemonSqueezySubscriptionEvent({
      body: subscriptionPayload({
        eventName: 'subscription_expired',
        status: 'expired',
      }),
      eventName: 'subscription_expired',
      variantPlanMap,
    });
    const repository = createInMemoryBillingRepository();

    const result = await processBillingSubscriptionEvent({ event, repository });

    expect(result).toMatchObject({
      accepted: true,
      planId: 'free',
      accessState: 'free',
    });
    expect((await repository.listSubscriptions())[0]).toMatchObject({
      providerSubscriptionId: 'sub_123',
      planId: 'free',
      accessState: 'free',
    });
  });
});
