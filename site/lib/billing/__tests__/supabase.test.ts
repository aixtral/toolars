import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import type {
  BillingProviderEventRecord,
  BillingSubscriptionRecord,
} from '@/lib/billing';
import { createSupabaseBillingRepository } from '@/lib/billing/supabase';

vi.mock('server-only', () => ({}));

type BillingTableName = 'subscription_events' | 'subscriptions';
type BillingRow = Record<string, unknown>;
type SupabaseError = { code?: string; message: string };

class FakeQuery {
  private selected = false;
  private filters: Record<string, unknown> = {};
  private writeOperation:
    | { type: 'insert' | 'upsert'; values: BillingRow; onConflict?: string }
    | null = null;

  constructor(
    private readonly table: BillingTableName,
    private readonly db: Record<BillingTableName, BillingRow[]>,
  ) {}

  insert(values: BillingRow) {
    this.writeOperation = { type: 'insert', values };
    return this;
  }

  upsert(values: BillingRow, options: { onConflict?: string }) {
    this.writeOperation = { type: 'upsert', values, onConflict: options.onConflict };
    return this;
  }

  select() {
    this.selected = true;
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters[column] = value;
    return this;
  }

  async single() {
    if (this.writeOperation) return this.applyWrite(true);
    return this.findOne(false);
  }

  async maybeSingle() {
    if (this.writeOperation) return this.applyWrite(false);
    return this.findOne(true);
  }

  then(resolve: (value: { data: BillingRow[]; error: null }) => void) {
    resolve({ data: [...this.rows], error: null });
  }

  private get rows() {
    return this.db[this.table].filter((row) =>
      Object.entries(this.filters).every(([key, value]) => row[key] === value),
    );
  }

  private applyWrite(requireRow: boolean) {
    if (!this.selected) throw new Error('expected select() after write');
    const operation = this.writeOperation;
    if (!operation) throw new Error('missing write operation');

    if (this.table === 'subscription_events') {
      const duplicate = this.db.subscription_events.find(
        (row) =>
          row.provider === operation.values.provider &&
          row.provider_event_id === operation.values.provider_event_id,
      );

      if (duplicate && operation.type === 'insert') {
        return {
          data: null,
          error: { code: '23505', message: 'duplicate key value violates unique constraint' },
        };
      }
    }

    if (this.table === 'subscriptions' && operation.type === 'upsert') {
      const existingIndex = this.db.subscriptions.findIndex(
        (row) =>
          row.provider === operation.values.provider &&
          row.provider_subscription_id === operation.values.provider_subscription_id,
      );

      if (existingIndex >= 0) {
        this.db.subscriptions[existingIndex] = {
          ...this.db.subscriptions[existingIndex],
          ...operation.values,
        };
        return { data: this.db.subscriptions[existingIndex], error: null };
      }
    }

    this.db[this.table].push(operation.values);
    const inserted = operation.values;
    return { data: inserted ?? (requireRow ? null : undefined), error: null };
  }

  private findOne(allowMissing: boolean) {
    const row = this.rows[0] ?? null;
    if (!row && !allowMissing) {
      return { data: null, error: { message: 'No rows returned' } as SupabaseError };
    }

    return { data: row, error: null };
  }
}

function createFakeSupabaseClient() {
  const db: Record<BillingTableName, BillingRow[]> = {
    subscription_events: [],
    subscriptions: [],
  };

  return {
    db,
    client: {
      from(table: BillingTableName) {
        return new FakeQuery(table, db);
      },
    },
  };
}

const providerEvent: BillingProviderEventRecord = {
  provider: 'lemon_squeezy',
  providerEventId: 'evt_123',
  eventName: 'subscription_created',
  providerObjectType: 'subscriptions',
  providerObjectId: 'sub_123',
  workspaceId: 'workspace_123',
  payloadHash: 'hash_123',
  processingStatus: 'processed',
  createdAt: '2026-06-07T00:00:00.000Z',
  processedAt: '2026-06-07T00:00:00.000Z',
};

const subscription: BillingSubscriptionRecord = {
  provider: 'lemon_squeezy',
  providerSubscriptionId: 'sub_123',
  workspaceId: 'workspace_123',
  providerCustomerId: 'cust_123',
  providerProductId: 'product_123',
  providerVariantId: '100',
  planId: 'pro',
  providerStatus: 'active',
  accessState: 'paid',
  renewsAt: '2026-07-07T00:00:00.000Z',
  customerPortalUrl: 'https://billing.example/customer',
  updatePaymentMethodUrl: 'https://billing.example/payment',
  lastProviderEventId: 'evt_123',
  updatedAt: '2026-06-07T00:00:00.000Z',
};

describe('Supabase billing repository', () => {
  it('marks the adapter module as server-only', () => {
    const source = readFileSync(
      join(process.cwd(), 'lib/billing/supabase.ts'),
      'utf8',
    );

    expect(source).toContain("import 'server-only'");
  });

  it('records provider events and returns duplicates idempotently', async () => {
    const { client, db } = createFakeSupabaseClient();
    const repository = createSupabaseBillingRepository(client);

    const first = await repository.recordProviderEvent(providerEvent);
    const second = await repository.recordProviderEvent(providerEvent);

    expect(first).toMatchObject({ duplicate: false, event: providerEvent });
    expect(second).toMatchObject({ duplicate: true, event: providerEvent });
    expect(db.subscription_events).toHaveLength(1);
    expect(db.subscription_events[0]).toMatchObject({
      provider_event_id: 'evt_123',
      workspace_id: 'workspace_123',
      processing_status: 'processed',
    });
  });

  it('upserts and reads subscription state by provider subscription id', async () => {
    const { client, db } = createFakeSupabaseClient();
    const repository = createSupabaseBillingRepository(client);

    await repository.upsertSubscription(subscription);
    const loaded = await repository.getSubscription('sub_123');

    expect(loaded).toMatchObject(subscription);
    expect(db.subscriptions).toHaveLength(1);
    expect(db.subscriptions[0]).toMatchObject({
      provider_subscription_id: 'sub_123',
      provider_customer_id: 'cust_123',
      plan_id: 'pro',
      access_state: 'paid',
      last_provider_event_id: 'evt_123',
    });
  });

  it('reads subscription state by workspace id for portal handoff', async () => {
    const { client } = createFakeSupabaseClient();
    const repository = createSupabaseBillingRepository(client);

    await repository.upsertSubscription(subscription);

    await expect(repository.getSubscriptionForWorkspace('workspace_123')).resolves.toMatchObject({
      providerSubscriptionId: 'sub_123',
      workspaceId: 'workspace_123',
      customerPortalUrl: 'https://billing.example/customer',
    });
    await expect(repository.getSubscriptionForWorkspace('workspace_missing')).resolves.toBeUndefined();
  });
});
