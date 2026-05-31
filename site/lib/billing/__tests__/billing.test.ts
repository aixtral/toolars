import { describe, expect, it } from 'vitest';
import {
  createBillingWebhookSignature,
  parseBillingWebhookEvent,
  verifyBillingWebhookSignature,
} from '@/lib/billing';

const body = JSON.stringify({
  id: 'evt_123',
  type: 'subscription.updated',
  data: {
    userId: 'user_123',
    planId: 'pro',
    status: 'active',
  },
});

describe('billing webhook verification', () => {
  it('accepts valid HMAC signatures and parses subscription events', () => {
    const timestamp = '1770000000';
    const secret = 'whsec_test';
    const signature = createBillingWebhookSignature({ body, secret, timestamp });

    expect(
      verifyBillingWebhookSignature({ body, secret, signature, timestamp }),
    ).toBe(true);
    expect(parseBillingWebhookEvent(body)).toEqual({
      id: 'evt_123',
      type: 'subscription.updated',
      userId: 'user_123',
      planId: 'pro',
      status: 'active',
    });
  });

  it('rejects invalid signatures', () => {
    expect(
      verifyBillingWebhookSignature({
        body,
        secret: 'whsec_test',
        signature: 'bad-signature',
        timestamp: '1770000000',
      }),
    ).toBe(false);
  });
});
