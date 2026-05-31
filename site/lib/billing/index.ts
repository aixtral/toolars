import { createHmac, timingSafeEqual } from 'node:crypto';
import { isPlanId } from '@/lib/plans';
import type { PlanId } from '@/lib/plans';

export type BillingSubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled';

const billingSubscriptionStatuses: readonly BillingSubscriptionStatus[] = [
  'active',
  'trialing',
  'past_due',
  'canceled',
];

export interface BillingWebhookSignatureInput {
  body: string;
  secret: string;
  timestamp: string;
}

export interface ParsedBillingWebhookEvent {
  id: string;
  type: 'subscription.updated';
  userId: string;
  planId: PlanId;
  status: BillingSubscriptionStatus;
}

function signedPayload({
  body,
  timestamp,
}: Pick<BillingWebhookSignatureInput, 'body' | 'timestamp'>) {
  return `${timestamp}.${body}`;
}

function isBillingSubscriptionStatus(
  status: string | undefined,
): status is BillingSubscriptionStatus {
  return Boolean(
    status && billingSubscriptionStatuses.includes(status as BillingSubscriptionStatus),
  );
}

export function createBillingWebhookSignature({
  body,
  secret,
  timestamp,
}: BillingWebhookSignatureInput) {
  return createHmac('sha256', secret)
    .update(signedPayload({ body, timestamp }))
    .digest('hex');
}

export function verifyBillingWebhookSignature({
  body,
  secret,
  signature,
  timestamp,
}: BillingWebhookSignatureInput & { signature: string }) {
  const expected = createBillingWebhookSignature({ body, secret, timestamp });
  const expectedBuffer = Buffer.from(expected, 'hex');
  const signatureBuffer = Buffer.from(signature, 'hex');

  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export function parseBillingWebhookEvent(body: string): ParsedBillingWebhookEvent {
  const payload = JSON.parse(body) as {
    id?: string;
    type?: string;
    data?: {
      userId?: string;
      planId?: string;
      status?: string;
    };
  };

  if (
    !payload.id ||
    payload.type !== 'subscription.updated' ||
    !payload.data?.userId ||
    !isPlanId(payload.data.planId) ||
    !isBillingSubscriptionStatus(payload.data.status)
  ) {
    throw new Error('Unsupported billing webhook event.');
  }

  return {
    id: payload.id,
    type: 'subscription.updated',
    userId: payload.data.userId,
    planId: payload.data.planId,
    status: payload.data.status,
  };
}
