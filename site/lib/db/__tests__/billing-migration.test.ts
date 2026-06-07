import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const migrationPath = join(
  process.cwd(),
  '..',
  'supabase/migrations/20260607123000_billing_subscription_state.sql',
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return readFileSync(migrationPath, 'utf8').toLowerCase();
}

describe('billing subscription Supabase migration', () => {
  it('creates durable subscription event and subscription tables', () => {
    const sql = readMigration();

    expect(sql).toContain('create table if not exists public.subscription_events');
    expect(sql).toContain('create table if not exists public.subscriptions');
    expect(sql).toContain('workspace_id uuid references public.workspaces(id)');
    expect(sql).toContain("provider text not null check (provider in ('lemon_squeezy'))");
    expect(sql).toContain("plan_id text not null check (plan_id in ('free', 'pro', 'team'))");
  });

  it('enforces provider-event and provider-subscription idempotency', () => {
    const sql = readMigration();

    expect(sql).toContain('unique (provider, provider_event_id)');
    expect(sql).toContain('unique (provider, provider_subscription_id)');
    expect(sql).toContain('subscription_events_provider_event_idx');
    expect(sql).toContain('subscriptions_workspace_id_idx');
  });

  it('enables RLS while leaving webhook mutations on the service-role path', () => {
    const sql = readMigration();

    expect(sql).toContain('alter table public.subscription_events enable row level security');
    expect(sql).toContain('alter table public.subscriptions enable row level security');
    expect(sql).toContain('grant select, insert, update on public.subscription_events to service_role');
    expect(sql).toContain('grant select, insert, update on public.subscriptions to service_role');
    expect(sql).not.toContain('to anon');
  });
});
