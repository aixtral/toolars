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

  it('keeps AI generation free for every plan during v1 (paywall disabled)', () => {
    // v1 decision: AI is free for all logged-in users. The paywall is
    // disabled at the access-evaluation layer; plan feature flags below
    // remain as data so phase-two can re-enable gating without API churn.
    const freeDecision = evaluateAiGenerationAccess({
      planId: 'free',
      selectedPlatformCount: 14,
      usedGenerations: 999,
    });
    expect(freeDecision.allowed).toBe(true);

    const proDecision = evaluateAiGenerationAccess({
      planId: 'pro',
      selectedPlatformCount: 14,
      usedGenerations: 0,
    });
    expect(proDecision.allowed).toBe(true);
  });

  it('allows Pro users within generation and platform limits', () => {
    const pro = getPlanById('pro');
    const decision = evaluateAiGenerationAccess({
      planId: 'pro',
      selectedPlatformCount: pro.maxPlatforms,
      usedGenerations: pro.monthlyAiGenerations - 1,
    });

    expect(decision.allowed).toBe(true);
  });
});
