// from https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning
import 'server-only';
import {
  type UsageMeterRepository,
  type UsagePeriod,
  type UsagePeriodInput,
  type UsageSnapshot,
} from './index';
import { createToolarsSupabaseServiceClient } from '@/lib/supabase/service';

type SupabaseError = {
  message?: string;
};

type SupabaseResult<T> = {
  data: T | null;
  error: SupabaseError | null;
};

type SupabaseUsageQueryBuilder<T> = {
  select(columns?: string): SupabaseUsageQueryBuilder<T>;
  eq(column: string, value: unknown): SupabaseUsageQueryBuilder<T>;
  maybeSingle(): Promise<SupabaseResult<T>>;
};

type SupabaseUsageRpcBuilder<T> = {
  single(): Promise<SupabaseResult<T>>;
};

export type SupabaseUsageMeterClient = {
  from(table: 'usage_counters'): unknown;
  rpc(functionName: SupabaseUsageRpcName, args: Record<string, unknown>): unknown;
};

type SupabaseUsageRpcName =
  | 'increment_ai_generation_usage'
  | 'increment_export_usage'
  | 'increment_batch_run_usage';

const usageColumns =
  'workspace_id, period_start, period_end, ai_generations_used, exports_used, batch_runs_used';

function usageTable(client: SupabaseUsageMeterClient) {
  return client.from('usage_counters') as SupabaseUsageQueryBuilder<Record<string, unknown>>;
}

function usageRpc(
  client: SupabaseUsageMeterClient,
  functionName: SupabaseUsageRpcName,
  args: Record<string, unknown>,
) {
  return client.rpc(
    functionName,
    args,
  ) as SupabaseUsageRpcBuilder<Record<string, unknown>>;
}

function zeroSnapshot({ workspaceId, period }: UsagePeriodInput): UsageSnapshot {
  return {
    workspaceId,
    period,
    aiGenerationsUsed: 0,
    exportsUsed: 0,
    batchRunsUsed: 0,
  };
}

function rowPeriod(row: Record<string, unknown>): UsagePeriod {
  return {
    periodStart: String(row.period_start),
    periodEnd: String(row.period_end),
  };
}

function snapshotFromRow(
  workspaceId: string,
  period: UsagePeriod,
  row: Record<string, unknown> | null,
): UsageSnapshot {
  if (!row) return zeroSnapshot({ workspaceId, period });

  return {
    workspaceId: String(row.workspace_id),
    period: rowPeriod(row),
    aiGenerationsUsed: Number(row.ai_generations_used ?? 0),
    exportsUsed: Number(row.exports_used ?? 0),
    batchRunsUsed: Number(row.batch_runs_used ?? 0),
  };
}

function throwUsageError(action: string, error: SupabaseError | null): never {
  throw new Error(`${action}: ${error?.message ?? 'Unknown Supabase usage error'}`);
}

export function createSupabaseUsageMeterRepository(
  client: SupabaseUsageMeterClient = createToolarsSupabaseServiceClient(),
): UsageMeterRepository {
  return {
    async readUsageSnapshot({ workspaceId, period }) {
      const result = await usageTable(client)
        .select(usageColumns)
        .eq('workspace_id', workspaceId)
        .eq('period_start', period.periodStart)
        .maybeSingle();

      if (result.error) {
        throwUsageError('Failed to read usage counter', result.error);
      }

      return snapshotFromRow(workspaceId, period, result.data);
    },

    async incrementAiGenerations({ workspaceId, period }) {
      const result = await usageRpc(client, 'increment_ai_generation_usage', {
        p_workspace_id: workspaceId,
        p_period_start: period.periodStart,
        p_period_end: period.periodEnd,
      }).single();

      if (result.error || !result.data) {
        throwUsageError('Failed to increment AI generation usage', result.error);
      }

      return snapshotFromRow(workspaceId, period, result.data);
    },

    async incrementExports({ workspaceId, period }) {
      const result = await usageRpc(client, 'increment_export_usage', {
        p_workspace_id: workspaceId,
        p_period_start: period.periodStart,
        p_period_end: period.periodEnd,
      }).single();

      if (result.error || !result.data) {
        throwUsageError('Failed to increment export usage', result.error);
      }

      return snapshotFromRow(workspaceId, period, result.data);
    },

    async incrementBatchRuns({ workspaceId, period }) {
      const result = await usageRpc(client, 'increment_batch_run_usage', {
        p_workspace_id: workspaceId,
        p_period_start: period.periodStart,
        p_period_end: period.periodEnd,
      }).single();

      if (result.error || !result.data) {
        throwUsageError('Failed to increment batch run usage', result.error);
      }

      return snapshotFromRow(workspaceId, period, result.data);
    },

    reset() {},
  };
}
