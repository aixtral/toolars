// from https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning
import 'server-only';
import type {
  BillingProviderEventRecord,
  BillingSubscriptionRecord,
  BillingSubscriptionRepository,
} from './index';
import { createToolarsSupabaseServiceClient } from '@/lib/supabase/service';

type SupabaseError = {
  code?: string;
  message?: string;
};

type SupabaseResult<T> = {
  data: T | null;
  error: SupabaseError | null;
};

type SupabaseQueryBuilder<T> = {
  insert(values: Record<string, unknown>): SupabaseQueryBuilder<T>;
  upsert(
    values: Record<string, unknown>,
    options: { onConflict?: string },
  ): SupabaseQueryBuilder<T>;
  select(columns?: string): SupabaseQueryBuilder<T>;
  eq(column: string, value: unknown): SupabaseQueryBuilder<T>;
  single(): Promise<SupabaseResult<T>>;
  maybeSingle(): Promise<SupabaseResult<T>>;
  then(
    resolve: (value: { data: T[]; error: SupabaseError | null }) => void,
    reject?: (reason: unknown) => void,
  ): void;
};

export type SupabaseBillingClient = {
  from(table: 'subscription_events' | 'subscriptions'): SupabaseQueryBuilder<Record<string, unknown>>;
};

const eventColumns =
  'provider, provider_event_id, event_name, provider_object_type, provider_object_id, workspace_id, payload_hash, processing_status, error_message, created_at, processed_at';

const subscriptionColumns =
  'provider, provider_subscription_id, workspace_id, provider_customer_id, provider_product_id, provider_variant_id, plan_id, provider_status, access_state, renews_at, ends_at, trial_ends_at, customer_portal_url, update_payment_method_url, last_provider_event_id, updated_at';

function nullish(value: string | undefined) {
  return value ?? null;
}

function optionalString(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function eventToRow(record: BillingProviderEventRecord) {
  return {
    provider: record.provider,
    provider_event_id: record.providerEventId,
    event_name: record.eventName,
    provider_object_type: record.providerObjectType,
    provider_object_id: record.providerObjectId,
    workspace_id: nullish(record.workspaceId),
    payload_hash: record.payloadHash,
    processing_status: record.processingStatus,
    error_message: nullish(record.errorMessage),
    created_at: record.createdAt,
    processed_at: nullish(record.processedAt),
  };
}

function eventFromRow(row: Record<string, unknown>): BillingProviderEventRecord {
  return {
    provider: 'lemon_squeezy',
    providerEventId: String(row.provider_event_id),
    eventName: String(row.event_name) as BillingProviderEventRecord['eventName'],
    providerObjectType: String(row.provider_object_type),
    providerObjectId: String(row.provider_object_id),
    workspaceId: optionalString(row.workspace_id),
    payloadHash: String(row.payload_hash),
    processingStatus: String(
      row.processing_status,
    ) as BillingProviderEventRecord['processingStatus'],
    errorMessage: optionalString(row.error_message),
    createdAt: String(row.created_at),
    processedAt: optionalString(row.processed_at),
  };
}

function subscriptionToRow(record: BillingSubscriptionRecord) {
  return {
    provider: record.provider,
    provider_subscription_id: record.providerSubscriptionId,
    workspace_id: nullish(record.workspaceId),
    provider_customer_id: nullish(record.providerCustomerId),
    provider_product_id: nullish(record.providerProductId),
    provider_variant_id: record.providerVariantId,
    plan_id: record.planId,
    provider_status: record.providerStatus,
    access_state: record.accessState,
    renews_at: nullish(record.renewsAt),
    ends_at: nullish(record.endsAt),
    trial_ends_at: nullish(record.trialEndsAt),
    customer_portal_url: nullish(record.customerPortalUrl),
    update_payment_method_url: nullish(record.updatePaymentMethodUrl),
    last_provider_event_id: record.lastProviderEventId,
    updated_at: record.updatedAt,
  };
}

function subscriptionFromRow(row: Record<string, unknown>): BillingSubscriptionRecord {
  return {
    provider: 'lemon_squeezy',
    providerSubscriptionId: String(row.provider_subscription_id),
    workspaceId: optionalString(row.workspace_id),
    providerCustomerId: optionalString(row.provider_customer_id),
    providerProductId: optionalString(row.provider_product_id),
    providerVariantId: String(row.provider_variant_id),
    planId: String(row.plan_id) as BillingSubscriptionRecord['planId'],
    providerStatus: String(row.provider_status) as BillingSubscriptionRecord['providerStatus'],
    accessState: String(row.access_state) as BillingSubscriptionRecord['accessState'],
    renewsAt: optionalString(row.renews_at),
    endsAt: optionalString(row.ends_at),
    trialEndsAt: optionalString(row.trial_ends_at),
    customerPortalUrl: optionalString(row.customer_portal_url),
    updatePaymentMethodUrl: optionalString(row.update_payment_method_url),
    lastProviderEventId: String(row.last_provider_event_id),
    updatedAt: String(row.updated_at),
  };
}

function isDuplicateError(error: SupabaseError | null) {
  return error?.code === '23505' || error?.message?.toLowerCase().includes('duplicate');
}

function throwSupabaseError(action: string, error: SupabaseError | null): never {
  throw new Error(`${action}: ${error?.message ?? 'Unknown Supabase billing error'}`);
}

export function createSupabaseBillingRepository(
  client: SupabaseBillingClient = createToolarsSupabaseServiceClient(),
): BillingSubscriptionRepository {
  return {
    async recordProviderEvent(record) {
      const inserted = await client
        .from('subscription_events')
        .insert(eventToRow(record))
        .select(eventColumns)
        .single();

      if (!inserted.error && inserted.data) {
        return { duplicate: false, event: eventFromRow(inserted.data) };
      }

      if (!isDuplicateError(inserted.error)) {
        throwSupabaseError('Failed to record billing provider event', inserted.error);
      }

      const existing = await client
        .from('subscription_events')
        .select(eventColumns)
        .eq('provider', record.provider)
        .eq('provider_event_id', record.providerEventId)
        .maybeSingle();

      if (existing.error || !existing.data) {
        throwSupabaseError('Failed to load duplicate billing provider event', existing.error);
      }

      return { duplicate: true, event: eventFromRow(existing.data) };
    },

    async upsertSubscription(record) {
      const result = await client
        .from('subscriptions')
        .upsert(subscriptionToRow(record), {
          onConflict: 'provider,provider_subscription_id',
        })
        .select(subscriptionColumns)
        .single();

      if (result.error) {
        throwSupabaseError('Failed to upsert billing subscription', result.error);
      }
    },

    async getSubscription(providerSubscriptionId) {
      const result = await client
        .from('subscriptions')
        .select(subscriptionColumns)
        .eq('provider', 'lemon_squeezy')
        .eq('provider_subscription_id', providerSubscriptionId)
        .maybeSingle();

      if (result.error) {
        throwSupabaseError('Failed to load billing subscription', result.error);
      }

      return result.data ? subscriptionFromRow(result.data) : undefined;
    },

    async listEvents() {
      const result = await client.from('subscription_events').select(eventColumns);
      if (result.error) {
        throwSupabaseError('Failed to list billing provider events', result.error);
      }

      return result.data.map(eventFromRow);
    },

    async listSubscriptions() {
      const result = await client.from('subscriptions').select(subscriptionColumns);
      if (result.error) {
        throwSupabaseError('Failed to list billing subscriptions', result.error);
      }

      return result.data.map(subscriptionFromRow);
    },

    reset() {},
  };
}
