import { afterEach, describe, expect, it } from 'vitest';
import type { ToolarsSession } from '@/lib/auth';
import { resetSecurityEvents } from '@/lib/security/events';
import {
  createInMemoryUsageMeterRepository,
  createMonthlyUsagePeriod,
} from '@/lib/usage';
import { createPdfExportHandler } from './route';

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

function exportRequest() {
  return new Request('http://127.0.0.1/api/exports/pdf', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      title: 'Mortgage Calculator',
      rows: [['Payment', '$2,184/mo']],
    }),
  });
}

describe('POST /api/exports/pdf', () => {
  afterEach(() => {
    resetSecurityEvents();
  });

  it('returns a deterministic PDF export placeholder and meters usage', async () => {
    const usageRepository = createInMemoryUsageMeterRepository();
    const now = new Date('2026-06-15T00:00:00.000Z');
    const handler = createPdfExportHandler({
      usageRepository,
      now: () => now,
      resolveSession: async () => session('team'),
    });

    const response = await handler(exportRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.export).toMatchObject({
      format: 'pdf',
      filename: 'toolars-mortgage-calculator.pdf',
      contentType: 'application/pdf',
      payloadKind: 'preview',
    });
    expect(body.usage).toMatchObject({
      remainingExports: 999,
    });
    await expect(
      usageRepository.readUsageSnapshot({
        workspaceId: 'workspace_team',
        period: createMonthlyUsagePeriod(now),
      }),
    ).resolves.toMatchObject({ exportsUsed: 1 });
  });
});
