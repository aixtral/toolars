'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { getPlanById } from '@/lib/plans';
import type { PlanId } from '@/lib/plans';

interface UpgradePromptProps {
  feature: string;
  reason: string;
  onUpgrade?: () => void;
}

interface UsagePlanCardProps {
  planId: PlanId;
  remainingGenerations: number;
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
        <Button type="button" onClick={onUpgrade}>
          Upgrade to Pro
        </Button>
      </CardContent>
    </Card>
  );
}

export function UsagePlanCard({ planId, remainingGenerations }: UsagePlanCardProps) {
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
          {remainingGenerations} AI generations left this month.
        </p>
        <ul className="grid gap-2 text-sm text-neutral-600">
          <li>PDF and CSV exports: {plan.features.includes('export.pdf') ? 'available' : 'Pro only'}</li>
          <li>Cross-device save: {plan.features.includes('save.crossDevice') ? 'available' : 'Pro only'}</li>
          <li>Batch tools: {plan.features.includes('batch.tools') ? 'available' : 'Pro only'}</li>
        </ul>
      </CardContent>
    </Card>
  );
}
