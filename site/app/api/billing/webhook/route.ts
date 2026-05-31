import {
  parseBillingWebhookEvent,
  verifyBillingWebhookSignature,
} from '@/lib/billing';

const defaultWebhookSecret = 'toolars-dev-webhook-secret';

export async function POST(request: Request) {
  const body = await request.text();
  const timestamp = request.headers.get('toolars-timestamp') ?? '';
  const signature = request.headers.get('toolars-signature') ?? '';
  const secret = process.env.TOOLARS_BILLING_WEBHOOK_SECRET ?? defaultWebhookSecret;

  if (!timestamp || !signature || !verifyBillingWebhookSignature({ body, secret, signature, timestamp })) {
    return Response.json({ error: 'Invalid billing webhook signature.' }, { status: 401 });
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
