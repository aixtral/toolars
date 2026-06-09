import { getSessionFromRequest } from '@/lib/auth';
import type { ToolarsSession } from '@/lib/auth';
import { evaluateBatchToolAccess, getPlanById } from '@/lib/plans';
import { recordSecurityEvent } from '@/lib/security/events';
import {
  createMonthlyUsagePeriod,
  type UsageMeterRepository,
} from '@/lib/usage';
import { createUsageMeterRuntimeRepository } from '@/lib/usage/runtime';

export interface BatchToolsHandlerOptions {
  usageRepository?: UsageMeterRepository;
  resolveSession?: (request: Request) => Promise<ToolarsSession | null>;
  now?: () => Date;
}

async function readToolSlugs(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return null;
  }

  if (!payload || typeof payload !== 'object') return null;

  const toolSlugs = (payload as Record<string, unknown>).toolSlugs;
  if (!Array.isArray(toolSlugs)) return null;

  const normalized = toolSlugs
    .filter((slug): slug is string => typeof slug === 'string')
    .map((slug) => slug.trim())
    .filter(Boolean);

  return normalized.length > 0 ? normalized : null;
}

function batchRunId(now: Date) {
  return `batch_${now.toISOString().replace(/[^0-9]/g, '').slice(0, 14)}`;
}

export function createBatchToolsHandler(options: BatchToolsHandlerOptions = {}) {
  return async function batchToolsHandler(request: Request) {
    const route = '/api/batch/tools';
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
        { error: 'Account required for batch tools.' },
        { status: 401 },
      );
    }

    const toolSlugs = await readToolSlugs(request);
    if (!toolSlugs) {
      recordSecurityEvent({
        request,
        route,
        category: 'usage',
        action: 'invalid_batch_payload',
        outcome: 'invalid',
        status: 400,
        metadata: {
          userId: session.userId,
          planId: session.planId,
        },
      });
      return Response.json(
        { error: 'Batch request requires at least one tool slug.' },
        { status: 400 },
      );
    }

    const usageRepository =
      options.usageRepository ?? (await createUsageMeterRuntimeRepository());
    const now = options.now?.() ?? new Date();
    const period = createMonthlyUsagePeriod(now);
    const usage = await usageRepository.readUsageSnapshot({
      workspaceId: session.workspaceId,
      period,
    });
    const gate = evaluateBatchToolAccess({
      planId: session.planId,
      usedBatchRuns: usage.batchRunsUsed,
    });

    if (!gate.allowed) {
      recordSecurityEvent({
        request,
        route,
        category: 'usage',
        action: 'plan_denied',
        outcome: 'denied',
        status: 402,
        metadata: {
          userId: session.userId,
          planId: session.planId,
          toolCount: toolSlugs.length,
        },
      });
      return Response.json(
        { error: gate.reason, upgradeLabel: gate.upgradeLabel },
        { status: 402 },
      );
    }

    const updatedUsage = await usageRepository.incrementBatchRuns({
      workspaceId: session.workspaceId,
      period,
    });
    const plan = getPlanById(session.planId);

    return Response.json({
      batch: {
        runId: batchRunId(now),
        status: 'queued',
        requestedTools: toolSlugs.length,
      },
      usage: {
        remainingBatchRuns: Math.max(
          0,
          plan.monthlyBatchRuns - updatedUsage.batchRunsUsed,
        ),
      },
    });
  };
}

export const POST = createBatchToolsHandler();
