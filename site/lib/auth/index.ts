import { isPlanId } from '@/lib/plans';
import { isPreviewAuthAllowed } from '@/lib/env/release-gate';
import { readSupabasePublicEnv } from '@/lib/supabase/env';
import { createToolarsSupabaseRequestClient } from '@/lib/supabase/server';
import { createToolarsSupabaseServiceClient } from '@/lib/supabase/service';
import {
  loadToolarsWorkspaceMembershipForUser,
  resolveToolarsSessionFromSupabase,
} from './supabase-session';
import type { PlanId } from '@/lib/plans';

export interface ToolarsSession {
  userId: string;
  email: string | null;
  workspaceId: string;
  planId: PlanId;
  role: 'owner' | 'admin' | 'member';
  isAuthenticated: true;
}

export interface GetSessionFromRequestOptions {
  resolveSupabaseSession?: (
    request: Request,
  ) => Promise<ToolarsSession | null>;
}

export function createPreviewSession(planId: PlanId = 'pro'): ToolarsSession {
  return {
    userId: `preview-${planId}-user`,
    email: `${planId}@preview.toolars.test`,
    workspaceId: `preview-${planId}-workspace`,
    planId,
    role: 'owner',
    isAuthenticated: true,
  };
}

function planFromPreview(value: string | undefined) {
  if (value === '1') return 'pro';
  return isPlanId(value) ? value : undefined;
}

function previewAuthEnabled() {
  return isPreviewAuthAllowed();
}

function hasSupabaseSessionEnv() {
  return (
    readSupabasePublicEnv().configured &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())
  );
}

async function resolveSupabaseSessionFromRequest(request: Request) {
  if (!hasSupabaseSessionEnv()) return null;

  try {
    const sessionClient = createToolarsSupabaseRequestClient(request);
    const serviceClient = createToolarsSupabaseServiceClient();

    return await resolveToolarsSessionFromSupabase({
      client: sessionClient,
      loadWorkspaceForUser(userId) {
        return loadToolarsWorkspaceMembershipForUser(serviceClient, userId);
      },
    });
  } catch {
    return null;
  }
}

export function getSessionFromSearchParams(searchParams: Record<string, string | undefined>) {
  if (!previewAuthEnabled()) return null;

  const planId = planFromPreview(searchParams.preview);
  return planId ? createPreviewSession(planId) : null;
}

export async function getSessionFromRequest(
  request: Request,
  options: GetSessionFromRequestOptions = {},
) {
  if (previewAuthEnabled() && request.headers.get('x-toolars-preview-user') === 'true') {
    const requestedPlan = request.headers.get('x-toolars-preview-plan');
    return createPreviewSession(isPlanId(requestedPlan) ? requestedPlan : 'pro');
  }

  return (options.resolveSupabaseSession ?? resolveSupabaseSessionFromRequest)(
    request,
  );
}
