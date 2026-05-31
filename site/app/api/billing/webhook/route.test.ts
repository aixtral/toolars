import { describe, expect, it } from 'vitest';
import { createBillingWebhookSignature } from '@/lib/billing';
import { POST } from './route';

const body = JSON.stringify({
  id: 'evt_456',
  type: 'subscription.updated',
  data: {
    userId: 'preview-pro-user',
    planId: 'pro',
    status: 'active',
  },
});

describe('POST /api/billing/webhook', () => {
  it('rejects unsigned billing webhooks', async () => {
    const response = await POST(
      new Request('http://127.0.0.1/api/billing/webhook', {
        method: 'POST',
        body,
      }),
    );

    expect(response.status).toBe(401);
  });

  it('accepts signed subscription webhook events', async () => {
    const timestamp = '1770000000';
    const secret = 'toolars-dev-webhook-secret';
    const signature = createBillingWebhookSignature({ body, secret, timestamp });
    const response = await POST(
      new Request('http://127.0.0.1/api/billing/webhook', {
        method: 'POST',
        headers: {
          'toolars-signature': signature,
          'toolars-timestamp': timestamp,
        },
        body,
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      received: true,
      eventId: 'evt_456',
      planId: 'pro',
      status: 'active',
    });
  });
});
