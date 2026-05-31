import {
  parseBillingWebhookEvent,
  verifyBillingWebhookSignature,
} from '@/lib/billing';

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
  const timestamp = request.headers.get('toolars-timestamp') ?? '';
  const signature = request.headers.get('toolars-signature') ?? '';
  const secret = billingWebhookSecret();

  if (!secret) {
    return Response.json(
      { error: 'Billing webhook secret is not configured.' },
      { status: 503 },
    );
  }

  if (
    !timestamp ||
    !signature ||
    !verifyBillingWebhookSignature({ body, secret, signature, timestamp })
  ) {
    return Response.json(
      { error: 'Invalid billing webhook signature.' },
      { status: 401 },
    );
  }

  try {
    const event = parseBillingWebhookEvent(body);

    return Response.json({
      received: true,
      eventId: event.id,
      planId: event.planId,
      status: event.status,
    });
  } catch {
    return Response.json({ error: 'Unsupported billing webhook event.' }, { status: 400 });
  }
}
