import { describe, expect, it } from 'vitest';
import {
  createInMemoryUsageMeterRepository,
  createMonthlyUsagePeriod,
} from '@/lib/usage';

describe('usage metering domain', () => {
  it('computes UTC monthly usage periods', () => {
    expect(createMonthlyUsagePeriod(new Date('2026-06-15T23:59:59.000Z'))).toEqual({
      periodStart: '2026-06-01',
      periodEnd: '2026-07-01',
    });

    expect(createMonthlyUsagePeriod(new Date('2026-12-31T23:59:59.000Z'))).toEqual({
      periodStart: '2026-12-01',
      periodEnd: '2027-01-01',
    });
  });

  it('returns zero usage for a workspace with no current counter row', async () => {
    const repository = createInMemoryUsageMeterRepository();
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

  it('increments AI generation usage for a workspace period', async () => {
    const repository = createInMemoryUsageMeterRepository();
    const period = createMonthlyUsagePeriod(new Date('2026-06-15T00:00:00.000Z'));

    const updated = await repository.incrementAiGenerations({
      workspaceId: 'workspace_123',
      period,
    });

    expect(updated).toMatchObject({
      workspaceId: 'workspace_123',
      aiGenerationsUsed: 1,
    });
    await expect(
      repository.readUsageSnapshot({ workspaceId: 'workspace_123', period }),
    ).resolves.toMatchObject({
      aiGenerationsUsed: 1,
    });
  });
});
