import { afterEach, describe, expect, it } from 'vitest';
import type { ToolarsSession } from '@/lib/auth';
import { resetSecurityEvents } from '@/lib/security/events';
import {
  createInMemoryUsageMeterRepository,
  createMonthlyUsagePeriod,
} from '@/lib/usage';
import { createBatchToolsHandler } from './route';

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

function batchRequest(body: unknown = { toolSlugs: ['bmi-calculator', 'mortgage-calculator'] }) {
  return new Request('http://127.0.0.1/api/batch/tools', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/batch/tools', () => {
  afterEach(() => {
    resetSecurityEvents();
  });

  it('denies Free workspaces before incrementing batch usage', async () => {
    const usageRepository = createInMemoryUsageMeterRepository();
    const now = new Date('2026-06-15T00:00:00.000Z');
    const handler = createBatchToolsHandler({
      usageRepository,
      now: () => now,
      resolveSession: async () => session('free'),
    });

    const response = await handler(batchRequest());

    expect(response.status).toBe(402);
    expect(await response.json()).toEqual({
      error: 'Batch tools require a Pro subscription.',
      upgradeLabel: 'Upgrade to Pro',
    });
    await expect(
      usageRepository.readUsageSnapshot({
        workspaceId: 'workspace_free',
        period: createMonthlyUsagePeriod(now),
      }),
    ).resolves.toMatchObject({ batchRunsUsed: 0 });
  });

  it('accepts Pro batch runs and meters batch usage once', async () => {
    const usageRepository = createInMemoryUsageMeterRepository();
    const now = new Date('2026-06-15T00:00:00.000Z');
    const handler = createBatchToolsHandler({
      usageRepository,
      now: () => now,
      resolveSession: async () => session('pro'),
    });

    const response = await handler(batchRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.batch).toMatchObject({
      status: 'queued',
      requestedTools: 2,
    });
    expect(body.batch.runId).toMatch(/^batch_/);
    expect(body.usage).toMatchObject({
      remainingBatchRuns: 99,
    });
    await expect(
      usageRepository.readUsageSnapshot({
        workspaceId: 'workspace_pro',
        period: createMonthlyUsagePeriod(now),
      }),
    ).resolves.toMatchObject({ batchRunsUsed: 1 });
  });
});
