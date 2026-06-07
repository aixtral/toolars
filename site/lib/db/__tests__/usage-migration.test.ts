import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const migrationPath = join(
  process.cwd(),
  '..',
  'supabase/migrations/20260607133000_usage_counters.sql',
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return readFileSync(migrationPath, 'utf8').toLowerCase();
}

describe('usage counters Supabase migration', () => {
  it('creates monthly workspace usage counters', () => {
    const sql = readMigration();

    expect(sql).toContain('create table if not exists public.usage_counters');
    expect(sql).toContain('workspace_id uuid not null references public.workspaces(id)');
    expect(sql).toContain('period_start date not null');
    expect(sql).toContain('period_end date not null');
    expect(sql).toContain('ai_generations_used integer not null default 0');
    expect(sql).toContain('exports_used integer not null default 0');
    expect(sql).toContain('batch_runs_used integer not null default 0');
  });

  it('enforces one counter row per workspace period with non-negative counts', () => {
    const sql = readMigration();

    expect(sql).toContain('unique (workspace_id, period_start)');
    expect(sql).toContain('check (period_end > period_start)');
    expect(sql).toContain('check (ai_generations_used >= 0)');
    expect(sql).toContain('usage_counters_workspace_period_idx');
  });

  it('enables RLS and keeps writes on the server service-role path', () => {
    const sql = readMigration();

    expect(sql).toContain('alter table public.usage_counters enable row level security');
    expect(sql).toContain('grant select, insert, update on public.usage_counters to service_role');
    expect(sql).not.toContain('to anon');
  });
});
