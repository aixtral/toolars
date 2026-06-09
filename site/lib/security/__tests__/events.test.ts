import { afterEach, describe, expect, it } from 'vitest';
import {
  readSecurityEvents,
  recordSecurityEvent,
  resetSecurityEvents,
} from '@/lib/security/events';

describe('security event recorder', () => {
  afterEach(() => {
    resetSecurityEvents();
  });

  it('records request IDs from headers and only keeps allowlisted metadata', () => {
    const event = recordSecurityEvent({
      request: new Request('http://127.0.0.1/api/ai/repurpose', {
        headers: {
          'x-request-id': 'req_known_123',
        },
      }),
      route: '/api/ai/repurpose',
      category: 'ai',
      action: 'plan_denied',
      outcome: 'denied',
      status: 402,
      metadata: {
        planId: 'free',
        selectedPlatformCount: 2,
        sourceValue: 'sensitive-ai-source-text',
        signature: 'sensitive-signature',
        secret: 'sensitive-secret',
        customerEmail: 'customer@example.com',
      },
    });

    expect(event.requestId).toBe('req_known_123');
    expect(event.metadata).toEqual({
      planId: 'free',
      selectedPlatformCount: 2,
    });
    expect(JSON.stringify(readSecurityEvents())).not.toContain('sensitive');
    expect(JSON.stringify(readSecurityEvents())).not.toContain('customer@example.com');
  });

  it('generates a request ID when the request has no x-request-id header', () => {
    const event = recordSecurityEvent({
      request: new Request('http://127.0.0.1/api/billing/webhook'),
      route: '/api/billing/webhook',
      category: 'billing',
      action: 'invalid_signature',
      outcome: 'invalid',
      status: 401,
      metadata: {
        eventName: 'subscription_created',
      },
    });

    expect(event.requestId).toMatch(/^req_/);
    expect(readSecurityEvents()).toHaveLength(1);
  });
});
