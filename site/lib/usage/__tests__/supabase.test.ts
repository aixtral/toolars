import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { createMonthlyUsagePeriod } from '@/lib/usage';
import { createSupabaseUsageMeterRepository } from '@/lib/usage/supabase';

vi.mock('server-only', () => ({}));

type UsageRow = Record<string, unknown>;
type SupabaseError = { message: string };
type UsageIncrementColumn =
  | 'ai_generations_used'
  | 'exports_used'
  | 'batch_runs_used';

class FakeUsageQuery {
  private filters: Record<string, unknown> = {};

  constructor(private readonly rows: UsageRow[]) {}

  select() {
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters[column] = value;
    return this;
  }

  async maybeSingle() {
    const row = this.rows.find((candidate) =>
      Object.entries(this.filters).every(([key, value]) => candidate[key] === value),
    );

    return { data: row ?? null, error: null };
  }
}

class FakeUsageRpc {
  constructor(
    private readonly rows: UsageRow[],
    private readonly functionName: string,
    private readonly args: Record<string, unknown>,
  ) {}

  async single(): Promise<{ data: UsageRow | null; error: SupabaseError | null }> {
    const incrementColumnByFunction: Record<string, UsageIncrementColumn> = {
      increment_ai_generation_usage: 'ai_generations_used',
      increment_export_usage: 'exports_used',
      increment_batch_run_usage: 'batch_runs_used',
    };
    const incrementColumn = incrementColumnByFunction[this.functionName];

    if (!incrementColumn) {
      return { data: null, error: { message: 'unsupported rpc' } };
    }

    const existing = this.rows.find(
      (row) =>
        row.workspace_id === this.args.p_workspace_id &&
        row.period_start === this.args.p_period_start,
    );

    if (existing) {
      existing[incrementColumn] = Number(existing[incrementColumn]) + 1;
      existing.period_end = this.args.p_period_end;
      return { data: existing, error: null };
    }

    const inserted: UsageRow = {
      workspace_id: this.args.p_workspace_id,
      period_start: this.args.p_period_start,
      period_end: this.args.p_period_end,
      ai_generations_used: incrementColumn === 'ai_generations_used' ? 1 : 0,
      exports_used: 0,
      batch_runs_used: 0,
    };
    inserted[incrementColumn] = 1;
    this.rows.push(inserted);
    return { data: inserted, error: null };
  }
}

function createFakeSupabaseClient(initialRows: UsageRow[] = []) {
  const rows = [...initialRows];

  return {
    rows,
    client: {
      from(table: 'usage_counters') {
        if (table !== 'usage_counters') throw new Error(`unexpected table ${table}`);
        return new FakeUsageQuery(rows);
      },
      rpc(functionName: string, args: Record<string, unknown>) {
        return new FakeUsageRpc(rows, functionName, args);
      },
    },
  };
}

describe('Supabase usage meter repository', () => {
  it('marks the adapter module as server-only', () => {
    const source = readFileSync(join(process.cwd(), 'lib/usage/supabase.ts'), 'utf8');

    expect(source).toContain("import 'server-only'");
    expect(source).toContain('createToolarsSupabaseServiceClient');
  });

  it('returns zero usage when no Supabase row exists for the workspace period', async () => {
    const { client } = createFakeSupabaseClient();
    const repository = createSupabaseUsageMeterRepository(client);
    const period = createMonthlyUsagePeriod(new Date('2026-06-15T00:00:00.000Z'));

    await expect(
      repository.readUsageSnapshot({ workspaceId: 'workspace_123', period }),
    ).resolves.toMatchObject({
      workspaceId: 'workspace_123',
      period,
      aiGenerationsUsed: 0,
      exportsUsed: 0,
      batchRunsUsed: 0,
    });
  });

  it('increments AI generation usage through the database RPC', async () => {
    const { client, rows } = createFakeSupabaseClient();
    const repository = createSupabaseUsageMeterRepository(client);
    const period = createMonthlyUsagePeriod(new Date('2026-06-15T00:00:00.000Z'));

    const first = await repository.incrementAiGenerations({
      workspaceId: 'workspace_123',
      period,
    });
    const second = await repository.incrementAiGenerations({
      workspaceId: 'workspace_123',
      period,
    });

    expect(first.aiGenerationsUsed).toBe(1);
    expect(second.aiGenerationsUsed).toBe(2);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      workspace_id: 'workspace_123',
      period_start: '2026-06-01',
      ai_generations_used: 2,
    });
  });

  it('increments export and batch usage through dedicated database RPCs', async () => {
    const { client, rows } = createFakeSupabaseClient();
    const repository = createSupabaseUsageMeterRepository(client);
    const period = createMonthlyUsagePeriod(new Date('2026-06-15T00:00:00.000Z'));

    const exported = await repository.incrementExports({
      workspaceId: 'workspace_123',
      period,
    });
    const batched = await repository.incrementBatchRuns({
      workspaceId: 'workspace_123',
      period,
    });

    expect(exported).toMatchObject({
      aiGenerationsUsed: 0,
      exportsUsed: 1,
      batchRunsUsed: 0,
    });
    expect(batched).toMatchObject({
      aiGenerationsUsed: 0,
      exportsUsed: 1,
      batchRunsUsed: 1,
    });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      workspace_id: 'workspace_123',
      period_start: '2026-06-01',
      exports_used: 1,
      batch_runs_used: 1,
    });
  });
});
