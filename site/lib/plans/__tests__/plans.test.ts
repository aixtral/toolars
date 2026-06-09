import { describe, expect, it } from 'vitest';
import {
  canUsePlanFeature,
  evaluateAiGenerationAccess,
  evaluateBatchToolAccess,
  evaluateExportAccess,
  getPlanById,
} from '@/lib/plans';

describe('plan gates', () => {
  it('keeps calculator usage free while gating AI and Pro capabilities', () => {
    expect(canUsePlanFeature('free', 'calculator.basic')).toBe(true);
    expect(canUsePlanFeature('free', 'ai.generate')).toBe(false);
    expect(canUsePlanFeature('free', 'export.pdf')).toBe(false);
    expect(canUsePlanFeature('free', 'save.crossDevice')).toBe(false);

    expect(canUsePlanFeature('pro', 'ai.generate')).toBe(true);
    expect(canUsePlanFeature('pro', 'export.csv')).toBe(true);
    expect(canUsePlanFeature('pro', 'batch.tools')).toBe(true);
    expect(canUsePlanFeature('team', 'workspace.admin')).toBe(true);
  });

  it('blocks limited plans with an upgrade path when AI limits are exceeded', () => {
    const decision = evaluateAiGenerationAccess({
      planId: 'free',
      selectedPlatformCount: 2,
      usedGenerations: 0,
    });

    expect(decision).toEqual({
      allowed: false,
      reason: 'AI generation requires a Pro subscription.',
      upgradeLabel: 'Upgrade to Pro',
    });
  });

  it('allows Pro users within generation and platform limits', () => {
    const pro = getPlanById('pro');
    const decision = evaluateAiGenerationAccess({
      planId: 'pro',
      selectedPlatformCount: pro.maxPlatforms,
      usedGenerations: pro.monthlyAiGenerations - 1,
    });

    expect(decision.allowed).toBe(true);
    expect(decision.reason).toBe('Pro AI access active.');
  });

  it('gates PDF and CSV exports by plan and monthly export usage', () => {
    expect(
      evaluateExportAccess({
        planId: 'free',
        format: 'pdf',
        usedExports: 0,
      }),
    ).toEqual({
      allowed: false,
      reason: 'PDF exports require a Pro subscription.',
      upgradeLabel: 'Upgrade to Pro',
    });

    const pro = getPlanById('pro');
    expect(
      evaluateExportAccess({
        planId: 'pro',
        format: 'csv',
        usedExports: pro.monthlyExports - 1,
      }),
    ).toEqual({
      allowed: true,
      reason: 'Pro CSV export access active.',
    });

    expect(
      evaluateExportAccess({
        planId: 'pro',
        format: 'csv',
        usedExports: pro.monthlyExports,
      }),
    ).toEqual({
      allowed: false,
      reason: 'Pro monthly export limit reached.',
      upgradeLabel: 'Manage plan',
    });
  });

  it('gates batch tools by plan and monthly batch usage', () => {
    expect(
      evaluateBatchToolAccess({
        planId: 'free',
        usedBatchRuns: 0,
      }),
    ).toEqual({
      allowed: false,
      reason: 'Batch tools require a Pro subscription.',
      upgradeLabel: 'Upgrade to Pro',
    });

    const team = getPlanById('team');
    expect(
      evaluateBatchToolAccess({
        planId: 'team',
        usedBatchRuns: team.monthlyBatchRuns - 1,
      }),
    ).toEqual({
      allowed: true,
      reason: 'Team batch tool access active.',
    });

    expect(
      evaluateBatchToolAccess({
        planId: 'team',
        usedBatchRuns: team.monthlyBatchRuns,
      }),
    ).toEqual({
      allowed: false,
      reason: 'Team monthly batch run limit reached.',
      upgradeLabel: 'Manage plan',
    });
  });
});
