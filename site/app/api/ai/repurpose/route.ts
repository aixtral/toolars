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

export async function POST(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return Response.json(
      { error: 'Account required for AI repurposing.' },
      { status: 401 },
    );
  }

  const boundedBody = await readBoundedRequestBody(request);
  if (!boundedBody.ok) {
    return Response.json({ error: boundedBody.error }, { status: boundedBody.status });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(boundedBody.body);
  } catch {
    return Response.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const normalized = normalizeRepurposeRequest(payload);
  const body = normalized.request;
  const errors = body
    ? [...normalized.errors, ...validateRepurposeRequest(body)]
    : normalized.errors;

  if (errors.length > 0) {
    return Response.json({ errors }, { status: 400 });
  }
  if (!body) {
    return Response.json({ errors: ['Invalid AI request payload.'] }, { status: 400 });
  }

  const plan = getPlanById(session.planId);
  const runtimeGuard = evaluateAiPreviewRuntimeGuard(session.userId);
  if (!runtimeGuard.allowed) {
    return Response.json({ error: runtimeGuard.error }, { status: runtimeGuard.status });
  }

  const usage = readAiPreviewRuntimeSnapshot(session.userId);
  const gate = evaluateAiGenerationAccess({
    planId: session.planId,
    selectedPlatformCount: body.platforms.length,
    usedGenerations: usage.usedGenerations,
  });

  if (!gate.allowed) {
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
