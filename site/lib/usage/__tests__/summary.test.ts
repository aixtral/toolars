import { describe, expect, it } from 'vitest';
import { buildUsageSummary } from '@/lib/usage/summary';

const period = {
  periodStart: '2026-06-01',
  periodEnd: '2026-07-01',
};

describe('customer usage summary', () => {
  it('builds Pro limits, used counts, and remaining counts from a snapshot', () => {
    expect(
      buildUsageSummary({
        planId: 'pro',
        snapshot: {
          workspaceId: 'workspace_123',
          period,
          aiGenerationsUsed: 17,
          exportsUsed: 3,
          batchRunsUsed: 2,
        },
      }),
    ).toEqual({
      planId: 'pro',
      planName: 'Pro',
      period,
      limits: {
        aiGenerations: 1000,
        exports: 200,
        batchRuns: 100,
      },
      used: {
        aiGenerations: 17,
        exports: 3,
        batchRuns: 2,
      },
      remaining: {
        aiGenerations: 983,
        exports: 197,
        batchRuns: 98,
      },
    });
  });

  it('caps remaining usage counts at zero when usage exceeds plan limits', () => {
    expect(
      buildUsageSummary({
        planId: 'free',
        snapshot: {
          workspaceId: 'workspace_123',
          period,
          aiGenerationsUsed: 1,
          exportsUsed: 1,
          batchRunsUsed: 1,
        },
      }).remaining,
    ).toEqual({
      aiGenerations: 0,
      exports: 0,
      batchRuns: 0,
    });
  });
});
