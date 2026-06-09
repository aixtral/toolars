import { getSessionFromRequest } from '@/lib/auth';
import type { ToolarsSession } from '@/lib/auth';
import { isPlanId, type PlanId } from '@/lib/plans';
import {
  buildBillingCheckoutUrl,
  readBillingHandoffConfig,
  type BillingHandoffConfig,
} from '@/lib/billing/handoff';
import { recordSecurityEvent } from '@/lib/security/events';

type EnvRecord = Partial<Record<string, string | undefined>>;

export interface BillingCheckoutHandlerOptions {
  env?: EnvRecord;
  resolveSession?: (request: Request) => Promise<ToolarsSession | null>;
}

function checkoutUrlForPlan(config: BillingHandoffConfig, planId: PlanId) {
  if (planId === 'pro') return config.proCheckoutUrl;
  if (planId === 'team') return config.teamCheckoutUrl;
  return undefined;
}

async function readPlanId(request: Request): Promise<PlanId | null> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    const planId = formData.get('planId');
    return typeof planId === 'string' && isPlanId(planId) ? planId : null;
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return null;
  }

  if (!payload || typeof payload !== 'object') return null;
  const planId = (payload as Record<string, unknown>).planId;
  return typeof planId === 'string' && isPlanId(planId) ? planId : null;
}

function planLabel(planId: PlanId) {
  return planId === 'team' ? 'Team' : 'Pro';
}

export function createBillingCheckoutHandler(
  options: BillingCheckoutHandlerOptions = {},
) {
  return async function billingCheckoutHandler(request: Request) {
    const route = '/api/billing/checkout';
    const session = await (options.resolveSession ?? getSessionFromRequest)(request);

    if (!session) {
      recordSecurityEvent({
        request,
        route,
        category: 'billing',
        action: 'missing_session',
        outcome: 'denied',
        status: 401,
      });
      return Response.json({ error: 'Account required for checkout.' }, { status: 401 });
    }

    const planId = await readPlanId(request);
    if (!planId || planId === 'free') {
      recordSecurityEvent({
        request,
        route,
        category: 'billing',
        action: 'invalid_plan',
        outcome: 'invalid',
        status: 400,
        metadata: {
          userId: session.userId,
          planId: planId ?? 'missing',
        },
      });
      return Response.json({ error: 'Choose a paid plan for checkout.' }, { status: 400 });
    }

    const config = readBillingHandoffConfig(options.env);
    const baseUrl = checkoutUrlForPlan(config, planId);
    const checkoutUrl = baseUrl
      ? buildBillingCheckoutUrl({
          baseUrl,
          session,
        })
      : null;

    if (!checkoutUrl) {
      recordSecurityEvent({
        request,
        route,
        category: 'billing',
        action: 'missing_checkout_config',
        outcome: 'failed',
        status: 503,
        metadata: {
          userId: session.userId,
          planId,
        },
      });
      return Response.json(
        { error: `${planLabel(planId)} checkout is not configured.` },
        { status: 503 },
      );
    }

    return Response.redirect(checkoutUrl, 303);
  };
}

export const POST = createBillingCheckoutHandler();
