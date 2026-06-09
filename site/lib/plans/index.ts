export type PlanId = 'free' | 'pro' | 'team';

export type PlanFeature =
  | 'calculator.basic'
  | 'ai.generate'
  | 'export.pdf'
  | 'export.csv'
  | 'save.crossDevice'
  | 'batch.tools'
  | 'workspace.admin';

export interface PlanDefinition {
  id: PlanId;
  name: string;
  monthlyAiGenerations: number;
  monthlyExports: number;
  monthlyBatchRuns: number;
  maxPlatforms: number;
  maxBrandVoices: number;
  features: readonly PlanFeature[];
}

export interface AiGenerationAccessInput {
  planId: PlanId;
  selectedPlatformCount: number;
  usedGenerations: number;
}

export type ExportFormat = 'pdf' | 'csv';

export interface ExportAccessInput {
  planId: PlanId;
  format: ExportFormat;
  usedExports: number;
}

export interface BatchToolAccessInput {
  planId: PlanId;
  usedBatchRuns: number;
}

export interface PlanGateDecision {
  allowed: boolean;
  reason: string;
  upgradeLabel?: string;
}

export const PLAN_DEFINITIONS: Record<PlanId, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'Free',
    monthlyAiGenerations: 0,
    monthlyExports: 0,
    monthlyBatchRuns: 0,
    maxPlatforms: 0,
    maxBrandVoices: 1,
    features: ['calculator.basic'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyAiGenerations: 1000,
    monthlyExports: 200,
    monthlyBatchRuns: 100,
    maxPlatforms: 14,
    maxBrandVoices: 10,
    features: [
      'calculator.basic',
      'ai.generate',
      'export.pdf',
      'export.csv',
      'save.crossDevice',
      'batch.tools',
    ],
  },
  team: {
    id: 'team',
    name: 'Team',
    monthlyAiGenerations: 5000,
    monthlyExports: 1000,
    monthlyBatchRuns: 500,
    maxPlatforms: 14,
    maxBrandVoices: 50,
    features: [
      'calculator.basic',
      'ai.generate',
      'export.pdf',
      'export.csv',
      'save.crossDevice',
      'batch.tools',
      'workspace.admin',
    ],
  },
};

export function isPlanId(value: string | null | undefined): value is PlanId {
  return value === 'free' || value === 'pro' || value === 'team';
}

export function getPlanById(planId: PlanId) {
  return PLAN_DEFINITIONS[planId];
}

export function canUsePlanFeature(planId: PlanId, feature: PlanFeature) {
  return PLAN_DEFINITIONS[planId].features.includes(feature);
}

export function evaluateAiGenerationAccess({
  planId,
  selectedPlatformCount,
  usedGenerations,
}: AiGenerationAccessInput): PlanGateDecision {
  const plan = getPlanById(planId);

  if (!canUsePlanFeature(planId, 'ai.generate')) {
    return {
      allowed: false,
      reason: 'AI generation requires a Pro subscription.',
      upgradeLabel: 'Upgrade to Pro',
    };
  }

  if (selectedPlatformCount > plan.maxPlatforms) {
    return {
      allowed: false,
      reason: `${plan.name} supports up to ${plan.maxPlatforms} platforms per generation.`,
      upgradeLabel: planId === 'pro' ? 'Talk to sales' : 'Upgrade to Pro',
    };
  }

  if (usedGenerations >= plan.monthlyAiGenerations) {
    return {
      allowed: false,
      reason: `${plan.name} monthly AI generation limit reached.`,
      upgradeLabel: planId === 'team' ? 'Manage plan' : 'Upgrade to Pro',
    };
  }

  return {
    allowed: true,
    reason: `${plan.name} AI access active.`,
  };
}

export function evaluateExportAccess({
  planId,
  format,
  usedExports,
}: ExportAccessInput): PlanGateDecision {
  const plan = getPlanById(planId);
  const feature = format === 'pdf' ? 'export.pdf' : 'export.csv';
  const formatLabel = format.toUpperCase();

  if (!canUsePlanFeature(planId, feature)) {
    return {
      allowed: false,
      reason: `${formatLabel} exports require a Pro subscription.`,
      upgradeLabel: 'Upgrade to Pro',
    };
  }

  if (usedExports >= plan.monthlyExports) {
    return {
      allowed: false,
      reason: `${plan.name} monthly export limit reached.`,
      upgradeLabel: 'Manage plan',
    };
  }

  return {
    allowed: true,
    reason: `${plan.name} ${formatLabel} export access active.`,
  };
}

export function evaluateBatchToolAccess({
  planId,
  usedBatchRuns,
}: BatchToolAccessInput): PlanGateDecision {
  const plan = getPlanById(planId);

  if (!canUsePlanFeature(planId, 'batch.tools')) {
    return {
      allowed: false,
      reason: 'Batch tools require a Pro subscription.',
      upgradeLabel: 'Upgrade to Pro',
    };
  }

  if (usedBatchRuns >= plan.monthlyBatchRuns) {
    return {
      allowed: false,
      reason: `${plan.name} monthly batch run limit reached.`,
      upgradeLabel: 'Manage plan',
    };
  }

  return {
    allowed: true,
    reason: `${plan.name} batch tool access active.`,
  };
}
