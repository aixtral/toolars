import { getSessionFromRequest } from '@/lib/auth';
import type { ToolarsSession } from '@/lib/auth';
import type { BillingSubscriptionRepository } from '@/lib/billing';
import { createBillingWebhookRuntimeRepository } from '@/lib/billing/runtime';
import {
  readBillingHandoffConfig,
  resolveSafeBillingUrl,
} from '@/lib/billing/handoff';
import { recordSecurityEvent } from '@/lib/security/events';

type EnvRecord = Partial<Record<string, string | undefined>>;

export interface BillingPortalHandlerOptions {
  env?: EnvRecord;
  repository?: BillingSubscriptionRepository;
  resolveSession?: (request: Request) => Promise<ToolarsSession | null>;
}

export function createBillingPortalHandler(
  options: BillingPortalHandlerOptions = {},
) {
  return async function billingPortalHandler(request: Request) {
    const route = '/api/billing/portal';
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
      return Response.json({ error: 'Account required for billing portal.' }, { status: 401 });
    }

    const repository =
      options.repository ?? (await createBillingWebhookRuntimeRepository());
    const subscription = await repository.getSubscriptionForWorkspace(session.workspaceId);
    const signedPortalUrl = resolveSafeBillingUrl(subscription?.customerPortalUrl);

    if (signedPortalUrl) {
      return Response.redirect(signedPortalUrl, 303);
    }

    const config = readBillingHandoffConfig(options.env);
    const fallbackPortalUrl = resolveSafeBillingUrl(config.portalUrl);

    if (fallbackPortalUrl) {
      return Response.redirect(fallbackPortalUrl, 303);
    }

    recordSecurityEvent({
      request,
      route,
      category: 'billing',
      action: 'missing_portal_target',
      outcome: 'failed',
      status: 404,
      metadata: {
        userId: session.userId,
        planId: session.planId,
      },
    });
    return Response.json(
      { error: 'Billing portal is not available for this workspace.' },
      { status: 404 },
    );
  };
}

export const GET = createBillingPortalHandler();
