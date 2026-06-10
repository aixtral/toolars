import { getPlanById, type PlanId } from '@/lib/plans';
import type { UsagePeriod, UsageSnapshot } from '@/lib/usage';

export interface UsageSummaryCounts {
  aiGenerations: number;
  exports: number;
  batchRuns: number;
}

export interface UsageSummary {
  planId: PlanId;
  planName: string;
  period: UsagePeriod;
  limits: UsageSummaryCounts;
  used: UsageSummaryCounts;
  remaining: UsageSummaryCounts;
}

interface UsageSummaryInput {
  planId: PlanId;
  snapshot: UsageSnapshot;
}

function remaining(limit: number, used: number) {
  return Math.max(0, limit - used);
}

export function buildUsageSummary({ planId, snapshot }: UsageSummaryInput): UsageSummary {
  const plan = getPlanById(planId);
  const limits = {
    aiGenerations: plan.monthlyAiGenerations,
    exports: plan.monthlyExports,
    batchRuns: plan.monthlyBatchRuns,
  };
  const used = {
    aiGenerations: snapshot.aiGenerationsUsed,
    exports: snapshot.exportsUsed,
    batchRuns: snapshot.batchRunsUsed,
  };

  return {
    planId,
    planName: plan.name,
    period: snapshot.period,
    limits,
    used,
    remaining: {
      aiGenerations: remaining(limits.aiGenerations, used.aiGenerations),
      exports: remaining(limits.exports, used.exports),
      batchRuns: remaining(limits.batchRuns, used.batchRuns),
    },
  };
}
