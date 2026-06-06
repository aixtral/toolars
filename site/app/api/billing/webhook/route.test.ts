import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createLemonSqueezyWebhookSignature,
  resetBillingWebhookRuntimeState,
} from '@/lib/billing';
import { readSecurityEvents, resetSecurityEvents } from '@/lib/security/events';
import { POST } from './route';

function subscriptionBody({
  status = 'active',
  variantId = 100,
  updatedAt = '2026-06-06T12:00:00.000000Z',
}: {
  status?: string;
  variantId?: number;
  updatedAt?: string;
} = {}) {
  return JSON.stringify({
    meta: {
      event_name: 'subscription_created',
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

function signedRequest(body: string, eventName = 'subscription_created') {
  const secret = 'lemon_test_secret';
  return new Request('http://127.0.0.1/api/billing/webhook', {
    method: 'POST',
    headers: {
      'X-Event-Name': eventName,
      'X-Signature': createLemonSqueezyWebhookSignature({ body, secret }),
    },
    body,
  });
}

describe('POST /api/billing/webhook', () => {
  beforeEach(() => {
    resetBillingWebhookRuntimeState();
    resetSecurityEvents();
    vi.stubEnv('TOOLARS_BILLING_WEBHOOK_SECRET', 'lemon_test_secret');
    vi.stubEnv('TOOLARS_LEMONSQUEEZY_PRO_VARIANT_IDS', '100');
    vi.stubEnv('TOOLARS_LEMONSQUEEZY_TEAM_VARIANT_IDS', '200');
  });

  afterEach(() => {
    resetBillingWebhookRuntimeState();
    resetSecurityEvents();
    vi.unstubAllEnvs();
  });

  it('rejects unsigned Lemon Squeezy webhook requests', async () => {
    const response = await POST(
      new Request('http://127.0.0.1/api/billing/webhook', {
        method: 'POST',
        body: subscriptionBody(),
      }),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: 'Invalid billing webhook signature.',
    });
    expect(readSecurityEvents()).toMatchObject([
      {
        route: '/api/billing/webhook',
        category: 'billing',
        action: 'invalid_signature',
        outcome: 'invalid',
        status: 401,
      },
    ]);
  });

  it('rejects old preview headers without Lemon X-Signature', async () => {
    const body = subscriptionBody();
    const response = await POST(
      new Request('http://127.0.0.1/api/billing/webhook', {
        method: 'POST',
        headers: {
          'toolars-signature': 'preview-signature',
          'toolars-timestamp': '1770000000',
        },
        body,
      }),
    );

    expect(response.status).toBe(401);
  });

  it('accepts signed Lemon subscription events and mutates subscription state', async () => {
    const response = await POST(signedRequest(subscriptionBody()));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      received: true,
      duplicate: false,
      eventName: 'subscription_created',
      providerObjectId: 'sub_123',
      planId: 'pro',
      accessState: 'paid',
    });
  });

  it('returns success without a second mutation for duplicate provider events', async () => {
    const body = subscriptionBody();

    const first = await POST(signedRequest(body));
    const second = await POST(signedRequest(body));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(await second.json()).toMatchObject({
      received: true,
      duplicate: true,
      providerObjectId: 'sub_123',
      planId: 'pro',
      accessState: 'paid',
    });
  });

  it('records unknown variants without granting paid access', async () => {
    const response = await POST(signedRequest(subscriptionBody({ variantId: 404 })));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: 'Unknown Lemon Squeezy subscription variant.',
      received: false,
    });
  });

  it('logs unsupported signed payloads without recording raw body or signature', async () => {
    const rawBody = JSON.stringify({
      meta: {
        event_name: 'subscription_created',
      },
      customer_email: 'customer@example.com',
      secret: 'lemon_test_secret',
      marker: 'sensitive-webhook-raw-body',
    });
    const signature = createLemonSqueezyWebhookSignature({
      body: rawBody,
      secret: 'lemon_test_secret',
    });

    const response = await POST(
      new Request('http://127.0.0.1/api/billing/webhook', {
        method: 'POST',
        headers: {
          'X-Event-Name': 'subscription_created',
          'X-Signature': signature,
        },
        body: rawBody,
      }),
    );

    expect(response.status).toBe(400);
    expect(readSecurityEvents()).toMatchObject([
      {
        route: '/api/billing/webhook',
        category: 'billing',
        action: 'unsupported_event',
        outcome: 'invalid',
        status: 400,
        metadata: {
          eventName: 'subscription_created',
        },
      },
    ]);
    const eventsJson = JSON.stringify(readSecurityEvents());
    expect(eventsJson).not.toContain('sensitive-webhook-raw-body');
    expect(eventsJson).not.toContain(signature);
    expect(eventsJson).not.toContain('lemon_test_secret');
    expect(eventsJson).not.toContain('customer@example.com');
  });

  it('does not accept the development fallback secret in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('TOOLARS_BILLING_WEBHOOK_SECRET', '');

    const body = subscriptionBody();
    const response = await POST(
      new Request('http://127.0.0.1/api/billing/webhook', {
        method: 'POST',
        headers: {
          'X-Event-Name': 'subscription_created',
          'X-Signature': createLemonSqueezyWebhookSignature({
            body,
            secret: 'toolars-dev-webhook-secret',
          }),
        },
        body,
      }),
    );

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: 'Billing webhook secret is not configured.',
    });
  });
});
