import { getSessionFromRequest } from '@/lib/auth';
import type { ToolarsSession } from '@/lib/auth';
import { recordSecurityEvent } from '@/lib/security/events';
import {
  createMonthlyUsagePeriod,
  type UsageMeterRepository,
} from '@/lib/usage';
import { createUsageMeterRuntimeRepository } from '@/lib/usage/runtime';
import { buildUsageSummary } from '@/lib/usage/summary';

export interface UsageSummaryHandlerOptions {
  usageRepository?: UsageMeterRepository;
  resolveSession?: (request: Request) => Promise<ToolarsSession | null>;
  now?: () => Date;
}

export function createUsageSummaryHandler(options: UsageSummaryHandlerOptions = {}) {
  return async function usageSummaryHandler(request: Request) {
    const route = '/api/usage/summary';
    const session = await (options.resolveSession ?? getSessionFromRequest)(request);

    if (!session) {
      recordSecurityEvent({
        request,
        route,
        category: 'usage',
        action: 'missing_session',
        outcome: 'denied',
        status: 401,
      });
      return Response.json(
        { error: 'Account required for usage summary.' },
        { status: 401 },
      );
    }

    const usageRepository =
      options.usageRepository ?? (await createUsageMeterRuntimeRepository());
    const period = createMonthlyUsagePeriod(options.now?.() ?? new Date());
    const snapshot = await usageRepository.readUsageSnapshot({
      workspaceId: session.workspaceId,
      period,
    });

    return Response.json({
      usage: buildUsageSummary({
        planId: session.planId,
        snapshot,
      }),
    });
  };
}

export const GET = createUsageSummaryHandler();
