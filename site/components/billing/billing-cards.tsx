'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { getPlanById } from '@/lib/plans';
import type { PlanId } from '@/lib/plans';
import type { UsageSummary } from '@/lib/usage/summary';

interface UpgradePromptProps {
  feature: string;
  reason: string;
  onUpgrade?: () => void;
}

interface UsagePlanCardProps {
  planId: PlanId;
  usageSummary: UsageSummary;
}

interface UsageMeterRowProps {
  label: string;
  used: number;
  limit: number;
  remaining: number;
}

function UsageMeterRow({ label, used, limit, remaining }: UsageMeterRowProps) {
  return (
    <li className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <div className="flex items-center justify-between gap-3 text-sm font-semibold text-ink">
        <span>{label}</span>
        <span>{remaining} {label.toLowerCase()} left</span>
      </div>
      <p className="mt-1 text-xs leading-4 text-neutral-600">
        {used} of {limit} used
      </p>
    </li>
  );
}

export function UpgradePrompt({ feature, reason, onUpgrade }: UpgradePromptProps) {
  return (
    <Card className="border-warning/50 bg-amber-50">
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          <Badge variant="warning">Paid action</Badge>
          <Badge>{feature}</Badge>
        </div>
        <CardTitle className="text-2xl leading-8">Upgrade to Pro</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{reason}</p>
        <form
          action="/api/billing/checkout"
          aria-label="Start Pro checkout"
          method="post"
          onSubmit={() => onUpgrade?.()}
        >
          <input name="planId" type="hidden" value="pro" />
          <Button type="submit">
            Upgrade to Pro
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function UsagePlanCard({ planId, usageSummary }: UsagePlanCardProps) {
  const plan = getPlanById(planId);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          <Badge variant={planId === 'free' ? 'default' : 'ai'}>{plan.name} plan</Badge>
          {planId === 'free' ? <Badge variant="warning">Upgrade available</Badge> : <Badge variant="success">Active</Badge>}
        </div>
        <CardTitle className="text-xl leading-7">{plan.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-semibold text-neutral-700">
          Current period usage
        </p>
        <p className="text-xs leading-4 text-neutral-500">
          Renews {usageSummary.period.periodEnd}
        </p>
        <ul className="grid gap-2">
          <UsageMeterRow
            label="AI generations"
            limit={usageSummary.limits.aiGenerations}
            remaining={usageSummary.remaining.aiGenerations}
            used={usageSummary.used.aiGenerations}
          />
          <UsageMeterRow
            label="Exports"
            limit={usageSummary.limits.exports}
            remaining={usageSummary.remaining.exports}
            used={usageSummary.used.exports}
          />
          <UsageMeterRow
            label="Batch runs"
            limit={usageSummary.limits.batchRuns}
            remaining={usageSummary.remaining.batchRuns}
            used={usageSummary.used.batchRuns}
          />
        </ul>
        <ul className="grid gap-2 text-sm text-neutral-600">
          <li>PDF and CSV exports: {plan.features.includes('export.pdf') ? 'available' : 'Pro only'}</li>
          <li>Cross-device save: {plan.features.includes('save.crossDevice') ? 'available' : 'Pro only'}</li>
          <li>Batch tools: {plan.features.includes('batch.tools') ? 'available' : 'Pro only'}</li>
        </ul>
        {planId === 'free' ? null : (
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:border-brand-500 hover:text-ink"
            href="/api/billing/portal"
          >
            Manage billing
          </a>
        )}
      </CardContent>
    </Card>
  );
}
