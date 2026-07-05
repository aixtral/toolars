import { isPlanId } from '@/lib/plans';
import type { PlanId } from '@/lib/plans';

export type { ToolarsSession } from './session';
export { getSession } from './session';

/**
 * Development-only preview session backdoor.
 *
 * Lets you exercise the AI workspace UI without registering during local dev.
 * In production (NODE_ENV === 'production' without TOOLARS_ENABLE_PREVIEW_AUTH)
 * these helpers always return null — only real Supabase sessions work.
 *
 * Phase-four migration: Server Components and Route Handlers should call
 * `getSession()` from this module instead. The preview helpers remain only for
 * the dev backdoor and are not a security boundary.
 */

function createPreviewSession(planId: PlanId = 'pro') {
  return {
    userId: `preview-${planId}-user`,
    email: `${planId}@preview.toolars.test`,
    planId,
    isAuthenticated: true as const,
  };
}

function planFromPreview(value: string | undefined) {
  if (value === '1') return 'pro';
  return isPlanId(value) ? value : undefined;
}

export function previewAuthEnabled() {
  return (
    process.env.NODE_ENV !== 'production' ||
    process.env.TOOLARS_ENABLE_PREVIEW_AUTH === 'true'
  );
}

/**
 * Dev backdoor: `?preview=pro` query param synthesizes a session. Returns null
 * in production. Prefer `getSession()` for real auth.
 */
export function getPreviewSessionFromSearchParams(
  searchParams: Record<string, string | undefined>,
) {
  if (!previewAuthEnabled()) return null;
  const planId = planFromPreview(searchParams.preview);
  return planId ? createPreviewSession(planId) : null;
}
