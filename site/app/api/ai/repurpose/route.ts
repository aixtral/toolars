import { createRepurposeJob, validateRepurposeRequest } from '@/lib/ai';
import {
  evaluateAiPreviewRuntimeGuard,
  normalizeRepurposeRequest,
  readAiPreviewRuntimeSnapshot,
  readBoundedRequestBody,
  recordAiPreviewGeneration,
} from '@/lib/ai/runtime-security';
import { getSessionFromRequest } from '@/lib/auth';
import { evaluateAiGenerationAccess, getPlanById } from '@/lib/plans';
import { recordSecurityEvent } from '@/lib/security/events';

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    recordSecurityEvent({
      request,
      route: '/api/ai/repurpose',
      category: 'ai',
      action: 'missing_session',
      outcome: 'denied',
      status: 401,
    });
    return Response.json(
      { error: 'Account required for AI repurposing.' },
      { status: 401 },
    );
  }

  const boundedBody = await readBoundedRequestBody(request);
  if (!boundedBody.ok) {
    recordSecurityEvent({
      request,
      route: '/api/ai/repurpose',
      category: 'ai',
      action: 'body_limit_exceeded',
      outcome: 'invalid',
      status: boundedBody.status,
    });
    return Response.json({ error: boundedBody.error }, { status: boundedBody.status });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(boundedBody.body);
  } catch {
    recordSecurityEvent({
      request,
      route: '/api/ai/repurpose',
      category: 'ai',
      action: 'invalid_json',
      outcome: 'invalid',
      status: 400,
    });
    return Response.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const normalized = normalizeRepurposeRequest(payload);
  const body = normalized.request;
  const errors = body
    ? [...normalized.errors, ...validateRepurposeRequest(body)]
    : normalized.errors;

  if (errors.length > 0) {
    recordSecurityEvent({
      request,
      route: '/api/ai/repurpose',
      category: 'ai',
      action: 'validation_failed',
      outcome: 'invalid',
      status: 400,
      metadata: {
        errorCount: errors.length,
      },
    });
    return Response.json({ errors }, { status: 400 });
  }
  if (!body) {
    recordSecurityEvent({
      request,
      route: '/api/ai/repurpose',
      category: 'ai',
      action: 'invalid_request',
      outcome: 'invalid',
      status: 400,
    });
    return Response.json({ errors: ['Invalid AI request payload.'] }, { status: 400 });
  }

  const plan = getPlanById(session.planId);
  const runtimeGuard = evaluateAiPreviewRuntimeGuard(session.userId);
  if (!runtimeGuard.allowed) {
    recordSecurityEvent({
      request,
      route: '/api/ai/repurpose',
      category: 'ai',
      action: 'preview_rate_limited',
      outcome: 'rate_limited',
      status: runtimeGuard.status,
      metadata: {
        userId: session.userId,
        planId: session.planId,
      },
    });
    return Response.json({ error: runtimeGuard.error }, { status: runtimeGuard.status });
  }

  const usage = readAiPreviewRuntimeSnapshot(session.userId);
  const gate = evaluateAiGenerationAccess({
    planId: session.planId,
    selectedPlatformCount: body.platforms.length,
    usedGenerations: usage.usedGenerations,
  });

  if (!gate.allowed) {
    recordSecurityEvent({
      request,
      route: '/api/ai/repurpose',
      category: 'ai',
      action: 'plan_denied',
      outcome: 'denied',
      status: 402,
      metadata: {
        userId: session.userId,
        planId: session.planId,
        selectedPlatformCount: body.platforms.length,
      },
    });
    return Response.json(
      { error: gate.reason, upgradeLabel: gate.upgradeLabel },
      { status: 402 },
    );
  }

  const job = createRepurposeJob(body);
  recordAiPreviewGeneration(session.userId);
  const updatedUsage = readAiPreviewRuntimeSnapshot(session.userId);

  return Response.json({
    job,
    usage: {
      plan: `${plan.name} preview`,
      remainingGenerations: Math.max(0, plan.monthlyAiGenerations - updatedUsage.usedGenerations),
    },
  });
}
