import { describe, expect, it } from 'vitest';
import {
  canUsePlanFeature,
  evaluateAiGenerationAccess,
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
});
