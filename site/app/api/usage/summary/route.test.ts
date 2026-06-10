import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ToolarsSession } from '@/lib/auth';
import { readSecurityEvents, resetSecurityEvents } from '@/lib/security/events';
import type { UsageMeterRepository, UsagePeriod, UsageSnapshot } from '@/lib/usage';
import { createUsageSummaryHandler } from './route';

function session(planId: ToolarsSession['planId']): ToolarsSession {
  return {
    userId: `user_${planId}`,
    email: `${planId}@toolars.test`,
    workspaceId: `workspace_${planId}`,
    planId,
    role: 'owner',
    isAuthenticated: true,
  };
}

function summaryRequest() {
  return new Request('http://127.0.0.1/api/usage/summary', {
    method: 'GET',
    headers: { 'x-request-id': 'req_usage_summary_test' },
  });
}

function createReadOnlyUsageRepository(snapshot: UsageSnapshot): UsageMeterRepository {
  return {
    readUsageSnapshot: vi.fn(async () => snapshot),
    incrementAiGenerations: vi.fn(async () => {
      throw new Error('GET /api/usage/summary must not increment AI usage');
    }),
    incrementExports: vi.fn(async () => {
      throw new Error('GET /api/usage/summary must not increment export usage');
    }),
    incrementBatchRuns: vi.fn(async () => {
      throw new Error('GET /api/usage/summary must not increment batch usage');
    }),
    reset: vi.fn(),
  };
}

describe('GET /api/usage/summary', () => {
  afterEach(() => {
    resetSecurityEvents();
  });

  it('rejects requests without an authenticated session', async () => {
    const handler = createUsageSummaryHandler({
      resolveSession: async () => null,
      now: () => new Date('2026-06-15T00:00:00.000Z'),
    });

    const response = await handler(summaryRequest());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: 'Account required for usage summary.',
    });
    expect(readSecurityEvents()).toMatchObject([
      {
        route: '/api/usage/summary',
        category: 'usage',
        action: 'missing_session',
        outcome: 'denied',
        status: 401,
      },
    ]);
  });

  it('returns the authenticated workspace current-period summary without incrementing usage', async () => {
    const period: UsagePeriod = {
      periodStart: '2026-06-01',
      periodEnd: '2026-07-01',
    };
    const usageRepository = createReadOnlyUsageRepository({
      workspaceId: 'workspace_pro',
      period,
      aiGenerationsUsed: 17,
      exportsUsed: 3,
      batchRunsUsed: 2,
    });
    const handler = createUsageSummaryHandler({
      usageRepository,
      resolveSession: async () => session('pro'),
      now: () => new Date('2026-06-15T00:00:00.000Z'),
    });

    const response = await handler(summaryRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      usage: {
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
      },
    });
    expect(usageRepository.readUsageSnapshot).toHaveBeenCalledWith({
      workspaceId: 'workspace_pro',
      period,
    });
    expect(usageRepository.incrementAiGenerations).not.toHaveBeenCalled();
    expect(usageRepository.incrementExports).not.toHaveBeenCalled();
    expect(usageRepository.incrementBatchRuns).not.toHaveBeenCalled();
  });
});
