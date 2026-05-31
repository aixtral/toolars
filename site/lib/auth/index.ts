import { isPlanId } from '@/lib/plans';
import type { PlanId } from '@/lib/plans';

export interface ToolarsSession {
  userId: string;
  email: string;
  planId: PlanId;
  isAuthenticated: true;
}

export function createPreviewSession(planId: PlanId = 'pro'): ToolarsSession {
  return {
    userId: `preview-${planId}-user`,
    email: `${planId}@preview.toolars.test`,
    planId,
    isAuthenticated: true,
  };
}

function planFromPreview(value: string | undefined) {
  if (value === '1') return 'pro';
  return isPlanId(value) ? value : undefined;
}

function previewAuthEnabled() {
  return (
    process.env.NODE_ENV !== 'production' ||
    process.env.TOOLARS_ENABLE_PREVIEW_AUTH === 'true'
  );
}

export function getSessionFromSearchParams(searchParams: Record<string, string | undefined>) {
  if (!previewAuthEnabled()) return null;

  const planId = planFromPreview(searchParams.preview);
  return planId ? createPreviewSession(planId) : null;
}

export function getSessionFromRequest(request: Request) {
  if (!previewAuthEnabled()) return null;
  if (request.headers.get('x-toolars-preview-user') !== 'true') return null;

  const requestedPlan = request.headers.get('x-toolars-preview-plan');
  return createPreviewSession(isPlanId(requestedPlan) ? requestedPlan : 'pro');
}
