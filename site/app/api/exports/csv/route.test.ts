import { afterEach, describe, expect, it } from 'vitest';
import type { ToolarsSession } from '@/lib/auth';
import { readSecurityEvents, resetSecurityEvents } from '@/lib/security/events';
import {
  createInMemoryUsageMeterRepository,
  createMonthlyUsagePeriod,
  type UsageMeterRepository,
} from '@/lib/usage';
import { createCsvExportHandler } from './route';

const exportPayload = {
  title: 'BMI Calculator',
  rows: [
    ['Metric', 'Value'],
    ['BMI', '22.4'],
  ],
};

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

function exportRequest(body: unknown = exportPayload) {
  return new Request('http://127.0.0.1/api/exports/csv', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/exports/csv', () => {
  afterEach(() => {
    resetSecurityEvents();
  });

  it('requires an authenticated workspace session before exporting', async () => {
    const handler = createCsvExportHandler({
      resolveSession: async () => null,
    });

    const response = await handler(exportRequest());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: 'Account required for CSV exports.',
    });
    expect(readSecurityEvents()).toMatchObject([
      {
        route: '/api/exports/csv',
        category: 'usage',
        action: 'missing_session',
        outcome: 'denied',
        status: 401,
      },
    ]);
  });

  it('denies Free workspaces without incrementing export usage', async () => {
    const usageRepository = createInMemoryUsageMeterRepository();
    const now = new Date('2026-06-15T00:00:00.000Z');
    const handler = createCsvExportHandler({
      usageRepository,
      now: () => now,
      resolveSession: async () => session('free'),
    });

    const response = await handler(exportRequest());

    expect(response.status).toBe(402);
    expect(await response.json()).toEqual({
      error: 'CSV exports require a Pro subscription.',
      upgradeLabel: 'Upgrade to Pro',
    });
    await expect(
      usageRepository.readUsageSnapshot({
        workspaceId: 'workspace_free',
        period: createMonthlyUsagePeriod(now),
      }),
    ).resolves.toMatchObject({ exportsUsed: 0 });
  });

  it('returns a deterministic CSV export payload and increments Pro usage once', async () => {
    const usageRepository = createInMemoryUsageMeterRepository();
    const now = new Date('2026-06-15T00:00:00.000Z');
    const handler = createCsvExportHandler({
      usageRepository,
      now: () => now,
      resolveSession: async () => session('pro'),
    });

    const response = await handler(exportRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.export).toMatchObject({
      format: 'csv',
      filename: 'toolars-bmi-calculator.csv',
      contentType: 'text/csv',
    });
    expect(body.export.payload).toContain('Metric,Value');
    expect(body.usage).toMatchObject({
      remainingExports: 199,
    });
    await expect(
      usageRepository.readUsageSnapshot({
        workspaceId: 'workspace_pro',
        period: createMonthlyUsagePeriod(now),
      }),
    ).resolves.toMatchObject({ exportsUsed: 1 });
  });

  it('denies paid workspaces at the monthly export limit without incrementing', async () => {
    const now = new Date('2026-06-15T00:00:00.000Z');
    const usageRepository: UsageMeterRepository = {
      async readUsageSnapshot({ workspaceId, period }) {
        return {
          workspaceId,
          period,
          aiGenerationsUsed: 0,
          exportsUsed: 200,
          batchRunsUsed: 0,
        };
      },
      async incrementAiGenerations() {
        throw new Error('not used in export tests');
      },
      async incrementExports() {
        throw new Error('plan-denied export must not increment usage');
      },
      async incrementBatchRuns() {
        throw new Error('not used in export tests');
      },
      reset() {},
    };
    const handler = createCsvExportHandler({
      usageRepository,
      now: () => now,
      resolveSession: async () => session('pro'),
    });

    const response = await handler(exportRequest());

    expect(response.status).toBe(402);
    expect(await response.json()).toEqual({
      error: 'Pro monthly export limit reached.',
      upgradeLabel: 'Manage plan',
    });
  });
});
