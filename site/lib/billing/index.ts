import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { PlanId } from '@/lib/plans';

export type LemonSqueezySubscriptionEventName =
  | 'subscription_created'
  | 'subscription_updated'
  | 'subscription_cancelled'
  | 'subscription_resumed'
  | 'subscription_expired'
  | 'subscription_paused'
  | 'subscription_unpaused'
  | 'subscription_plan_changed'
  | 'subscription_payment_success'
  | 'subscription_payment_failed'
  | 'subscription_payment_recovered';

export type LemonSqueezySubscriptionStatus =
  | 'on_trial'
  | 'active'
  | 'paused'
  | 'past_due'
  | 'unpaid'
  | 'cancelled'
  | 'expired';

export type BillingAccessState =
  | 'paid'
  | 'grace'
  | 'paused'
  | 'paid_until_end'
  | 'free';

export type BillingProvider = 'lemon_squeezy';
export type BillingEventProcessingStatus = 'processed' | 'failed';
export type Awaitable<T> = T | Promise<T>;

export interface LemonSqueezyWebhookSignatureInput {
  body: string;
  secret: string;
}

export interface ParsedLemonSqueezySubscriptionEvent {
  provider: BillingProvider;
  providerEventId: string;
  eventName: LemonSqueezySubscriptionEventName;
  providerObjectType: 'subscriptions';
  providerObjectId: string;
  payloadHash: string;
  workspaceId?: string;
  providerCustomerId?: string;
  providerProductId?: string;
  providerVariantId: string;
  mappedPlanId: PlanId | null;
  planId: PlanId;
  providerStatus: LemonSqueezySubscriptionStatus;
  accessState: BillingAccessState;
  renewsAt?: string;
  endsAt?: string;
  trialEndsAt?: string;
  customerPortalUrl?: string;
  updatePaymentMethodUrl?: string;
}

export interface BillingProviderEventRecord {
  provider: BillingProvider;
  providerEventId: string;
  eventName: LemonSqueezySubscriptionEventName;
  providerObjectType: string;
  providerObjectId: string;
  workspaceId?: string;
  payloadHash: string;
  processingStatus: BillingEventProcessingStatus;
  errorMessage?: string;
  createdAt: string;
  processedAt?: string;
}

export interface BillingSubscriptionRecord {
  provider: BillingProvider;
  providerSubscriptionId: string;
  workspaceId?: string;
  providerCustomerId?: string;
  providerProductId?: string;
  providerVariantId: string;
  planId: PlanId;
  providerStatus: LemonSqueezySubscriptionStatus;
  accessState: BillingAccessState;
  renewsAt?: string;
  endsAt?: string;
  trialEndsAt?: string;
  customerPortalUrl?: string;
  updatePaymentMethodUrl?: string;
  lastProviderEventId: string;
  updatedAt: string;
}

export interface BillingSubscriptionRepository {
  recordProviderEvent(record: BillingProviderEventRecord): Awaitable<{
    duplicate: boolean;
    event: BillingProviderEventRecord;
  }>;
  upsertSubscription(record: BillingSubscriptionRecord): Awaitable<void>;
  getSubscription(
    providerSubscriptionId: string,
  ): Awaitable<BillingSubscriptionRecord | undefined>;
  listEvents(): Awaitable<BillingProviderEventRecord[]>;
  listSubscriptions(): Awaitable<BillingSubscriptionRecord[]>;
  reset(): Awaitable<void>;
}

export interface ProcessBillingSubscriptionEventInput {
  event: ParsedLemonSqueezySubscriptionEvent;
  repository: BillingSubscriptionRepository;
  now?: string;
}

export interface ProcessBillingSubscriptionEventResult {
  accepted: boolean;
  duplicate: boolean;
  received: boolean;
  eventId: string;
  eventName: LemonSqueezySubscriptionEventName;
  providerObjectId: string;
  planId: PlanId;
  accessState: BillingAccessState;
  error?: string;
}

const supportedSubscriptionEvents: readonly LemonSqueezySubscriptionEventName[] = [
  'subscription_created',
  'subscription_updated',
  'subscription_cancelled',
  'subscription_resumed',
  'subscription_expired',
  'subscription_paused',
  'subscription_unpaused',
  'subscription_plan_changed',
  'subscription_payment_success',
  'subscription_payment_failed',
  'subscription_payment_recovered',
];

const supportedSubscriptionStatuses: readonly LemonSqueezySubscriptionStatus[] = [
  'on_trial',
  'active',
  'paused',
  'past_due',
  'unpaid',
  'cancelled',
  'expired',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function optionalId(value: unknown): string | undefined {
  if (typeof value === 'string' && value.length > 0) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return undefined;
}

function payloadSha256(body: string) {
  return createHash('sha256').update(body).digest('hex');
}

function isLemonSqueezySubscriptionEventName(
  value: string,
): value is LemonSqueezySubscriptionEventName {
  return supportedSubscriptionEvents.includes(value as LemonSqueezySubscriptionEventName);
}

function isLemonSqueezySubscriptionStatus(
  value: string,
): value is LemonSqueezySubscriptionStatus {
  return supportedSubscriptionStatuses.includes(value as LemonSqueezySubscriptionStatus);
}

function planForAccessState(
  mappedPlanId: PlanId | null,
  accessState: BillingAccessState,
): PlanId {
  if (!mappedPlanId) return 'free';
  return accessState === 'free' || accessState === 'paused' ? 'free' : mappedPlanId;
}

export function createLemonSqueezyWebhookSignature({
  body,
  secret,
}: LemonSqueezyWebhookSignatureInput) {
  return createHmac('sha256', secret).update(body).digest('hex');
}

export function verifyLemonSqueezyWebhookSignature({
  body,
  secret,
  signature,
}: LemonSqueezyWebhookSignatureInput & { signature: string }) {
  const expected = createLemonSqueezyWebhookSignature({ body, secret });
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');

  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export function mapLemonSqueezyStatusToAccessState(
  status: LemonSqueezySubscriptionStatus,
): BillingAccessState {
  if (status === 'active' || status === 'on_trial') return 'paid';
  if (status === 'past_due') return 'grace';
  if (status === 'paused') return 'paused';
  if (status === 'cancelled') return 'paid_until_end';
  return 'free';
}

export function parseLemonSqueezySubscriptionEvent({
  body,
  eventName,
  variantPlanMap,
}: {
  body: string;
  eventName: string;
  variantPlanMap: ReadonlyMap<string, PlanId>;
}): ParsedLemonSqueezySubscriptionEvent {
  if (!isLemonSqueezySubscriptionEventName(eventName)) {
    throw new Error('Unsupported billing webhook event.');
  }

  const payload = JSON.parse(body) as unknown;
  if (!isRecord(payload)) throw new Error('Unsupported billing webhook event.');

  const meta = isRecord(payload.meta) ? payload.meta : undefined;
  const metaEventName = optionalString(meta?.event_name);
  if (metaEventName && metaEventName !== eventName) {
    throw new Error('Unsupported billing webhook event.');
  }

  const customData = isRecord(meta?.custom_data) ? meta.custom_data : undefined;
  const data = isRecord(payload.data) ? payload.data : undefined;
  const attributes = isRecord(data?.attributes) ? data.attributes : undefined;
  const urls = isRecord(attributes?.urls) ? attributes.urls : undefined;

  const providerObjectId = optionalId(data?.id);
  const providerVariantId = optionalId(attributes?.variant_id);
  const providerStatus = optionalString(attributes?.status);

  if (
    data?.type !== 'subscriptions' ||
    !providerObjectId ||
    !providerVariantId ||
    !providerStatus ||
    !isLemonSqueezySubscriptionStatus(providerStatus)
  ) {
    throw new Error('Unsupported billing webhook event.');
  }

  const hash = payloadSha256(body);
  const accessState = mapLemonSqueezyStatusToAccessState(providerStatus);
  const mappedPlanId = variantPlanMap.get(providerVariantId) ?? null;

  return {
    provider: 'lemon_squeezy',
    providerEventId: `lemon_squeezy:${eventName}:subscriptions:${providerObjectId}:${hash.slice(
      0,
      16,
    )}`,
    eventName,
    providerObjectType: 'subscriptions',
    providerObjectId,
    payloadHash: hash,
    workspaceId: optionalString(customData?.workspace_id),
    providerCustomerId: optionalId(attributes?.customer_id),
    providerProductId: optionalId(attributes?.product_id),
    providerVariantId,
    mappedPlanId,
    planId: planForAccessState(mappedPlanId, accessState),
    providerStatus,
    accessState,
    renewsAt: optionalString(attributes?.renews_at),
    endsAt: optionalString(attributes?.ends_at),
    trialEndsAt: optionalString(attributes?.trial_ends_at),
    customerPortalUrl: optionalString(urls?.customer_portal),
    updatePaymentMethodUrl: optionalString(urls?.update_payment_method),
  };
}

export async function processBillingSubscriptionEvent({
  event,
  repository,
  now = new Date().toISOString(),
}: ProcessBillingSubscriptionEventInput): Promise<ProcessBillingSubscriptionEventResult> {
  const error = event.mappedPlanId
    ? undefined
    : 'Unknown Lemon Squeezy subscription variant.';
  const recorded = await repository.recordProviderEvent({
    provider: event.provider,
    providerEventId: event.providerEventId,
    eventName: event.eventName,
    providerObjectType: event.providerObjectType,
    providerObjectId: event.providerObjectId,
    workspaceId: event.workspaceId,
    payloadHash: event.payloadHash,
    processingStatus: error ? 'failed' : 'processed',
    errorMessage: error,
    createdAt: now,
    processedAt: now,
  });

  if (recorded.duplicate) {
    const subscription = await repository.getSubscription(event.providerObjectId);
    return {
      accepted: recorded.event.processingStatus === 'processed',
      duplicate: true,
      received: recorded.event.processingStatus === 'processed',
      eventId: event.providerEventId,
      eventName: event.eventName,
      providerObjectId: event.providerObjectId,
      planId: subscription?.planId ?? event.planId,
      accessState: subscription?.accessState ?? event.accessState,
      error: recorded.event.errorMessage,
    };
  }

  if (error) {
    return {
      accepted: false,
      duplicate: false,
      received: false,
      eventId: event.providerEventId,
      eventName: event.eventName,
      providerObjectId: event.providerObjectId,
      planId: 'free',
      accessState: 'free',
      error,
    };
  }

  await repository.upsertSubscription({
    provider: event.provider,
    providerSubscriptionId: event.providerObjectId,
    workspaceId: event.workspaceId,
    providerCustomerId: event.providerCustomerId,
    providerProductId: event.providerProductId,
    providerVariantId: event.providerVariantId,
    planId: event.planId,
    providerStatus: event.providerStatus,
    accessState: event.accessState,
    renewsAt: event.renewsAt,
    endsAt: event.endsAt,
    trialEndsAt: event.trialEndsAt,
    customerPortalUrl: event.customerPortalUrl,
    updatePaymentMethodUrl: event.updatePaymentMethodUrl,
    lastProviderEventId: event.providerEventId,
    updatedAt: now,
  });

  return {
    accepted: true,
    duplicate: false,
    received: true,
    eventId: event.providerEventId,
    eventName: event.eventName,
    providerObjectId: event.providerObjectId,
    planId: event.planId,
    accessState: event.accessState,
  };
}

export function createInMemoryBillingRepository(): BillingSubscriptionRepository {
  const events = new Map<string, BillingProviderEventRecord>();
  const subscriptions = new Map<string, BillingSubscriptionRecord>();

  return {
    recordProviderEvent(record) {
      const existing = events.get(record.providerEventId);
      if (existing) return { duplicate: true, event: existing };

      events.set(record.providerEventId, record);
      return { duplicate: false, event: record };
    },
    upsertSubscription(record) {
      subscriptions.set(record.providerSubscriptionId, record);
    },
    getSubscription(providerSubscriptionId) {
      return subscriptions.get(providerSubscriptionId);
    },
    listEvents() {
      return [...events.values()];
    },
    listSubscriptions() {
      return [...subscriptions.values()];
    },
    reset() {
      events.clear();
      subscriptions.clear();
    },
  };
}

export function createLemonSqueezyVariantPlanMap(
  env: NodeJS.ProcessEnv = process.env,
) {
  const map = new Map<string, PlanId>();
  const addValues = (rawValue: string | undefined, planId: PlanId) => {
    rawValue
      ?.split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .forEach((value) => map.set(value, planId));
  };

  addValues(env.TOOLARS_LEMONSQUEEZY_PRO_VARIANT_IDS, 'pro');
  addValues(env.TOOLARS_LEMONSQUEEZY_TEAM_VARIANT_IDS, 'team');
  addValues(env.LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID, 'pro');
  addValues(env.LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID, 'pro');
  addValues(env.LEMONSQUEEZY_TEAM_MONTHLY_VARIANT_ID, 'team');
  addValues(env.LEMONSQUEEZY_TEAM_YEARLY_VARIANT_ID, 'team');

  return map;
}

const billingWebhookRuntimeRepository = createInMemoryBillingRepository();

export function processBillingWebhookRuntimeEvent(
  event: ParsedLemonSqueezySubscriptionEvent,
  repository: BillingSubscriptionRepository = billingWebhookRuntimeRepository,
) {
  return processBillingSubscriptionEvent({
    event,
    repository,
  });
}

export async function readBillingWebhookRuntimeSnapshot() {
  return {
    events: await billingWebhookRuntimeRepository.listEvents(),
    subscriptions: await billingWebhookRuntimeRepository.listSubscriptions(),
  };
}

export function resetBillingWebhookRuntimeState() {
  billingWebhookRuntimeRepository.reset();
}
