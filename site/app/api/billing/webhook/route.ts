import {
  createLemonSqueezyVariantPlanMap,
  parseLemonSqueezySubscriptionEvent,
  processBillingWebhookRuntimeEvent,
  verifyLemonSqueezyWebhookSignature,
} from '@/lib/billing';
import { recordSecurityEvent } from '@/lib/security/events';

const developmentWebhookSecret = 'toolars-dev-webhook-secret';

function billingWebhookSecret() {
  if (process.env.TOOLARS_BILLING_WEBHOOK_SECRET) {
    return process.env.TOOLARS_BILLING_WEBHOOK_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return developmentWebhookSecret;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('X-Signature') ?? '';
  const eventName = request.headers.get('X-Event-Name') ?? '';
  const secret = billingWebhookSecret();

  if (!secret) {
    recordSecurityEvent({
      request,
      route: '/api/billing/webhook',
      category: 'billing',
      action: 'missing_secret',
      outcome: 'failed',
      status: 503,
      metadata: {
        eventName,
      },
    });
    return Response.json(
      { error: 'Billing webhook secret is not configured.' },
      { status: 503 },
    );
  }

  if (
    !signature ||
    !verifyLemonSqueezyWebhookSignature({ body, secret, signature })
  ) {
    recordSecurityEvent({
      request,
      route: '/api/billing/webhook',
      category: 'billing',
      action: 'invalid_signature',
      outcome: 'invalid',
      status: 401,
      metadata: {
        eventName,
      },
    });
    return Response.json(
      { error: 'Invalid billing webhook signature.' },
      { status: 401 },
    );
  }

  try {
    const event = parseLemonSqueezySubscriptionEvent({
      body,
      eventName,
      variantPlanMap: createLemonSqueezyVariantPlanMap(),
    });
    const result = processBillingWebhookRuntimeEvent(event);

    if (!result.accepted) {
      recordSecurityEvent({
        request,
        route: '/api/billing/webhook',
        category: 'billing',
        action: 'event_processing_failed',
        outcome: 'failed',
        status: 400,
        metadata: {
          eventId: result.eventId,
          eventName: result.eventName,
          providerObjectId: result.providerObjectId,
        },
      });
      return Response.json(
        {
          received: false,
          error: result.error ?? 'Unsupported billing webhook event.',
          eventId: result.eventId,
          eventName: result.eventName,
          providerObjectId: result.providerObjectId,
        },
        { status: 400 },
      );
    }

    return Response.json({
      received: true,
      duplicate: result.duplicate,
      eventId: result.eventId,
      eventName: result.eventName,
      providerObjectId: result.providerObjectId,
      planId: result.planId,
      accessState: result.accessState,
    });
  } catch {
    recordSecurityEvent({
      request,
      route: '/api/billing/webhook',
      category: 'billing',
      action: 'unsupported_event',
      outcome: 'invalid',
      status: 400,
      metadata: {
        eventName,
      },
    });
    return Response.json({ error: 'Unsupported billing webhook event.' }, { status: 400 });
  }
}
