import { createRepurposeJob, validateRepurposeRequest } from '@/lib/ai';
import type { RepurposeRequest } from '@/lib/ai';
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

  let body: RepurposeRequest;
  try {
    body = (await request.json()) as RepurposeRequest;
  } catch {
    return Response.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const errors = validateRepurposeRequest(body);
  if (errors.length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  const plan = getPlanById(session.planId);
  const gate = evaluateAiGenerationAccess({
    planId: session.planId,
    selectedPlatformCount: body.platforms.length,
    usedGenerations: 0,
  });

  if (!gate.allowed) {
    return Response.json(
      { error: gate.reason, upgradeLabel: gate.upgradeLabel },
      { status: 402 },
    );
  }

  const job = createRepurposeJob(body);

  return Response.json({
    job,
    usage: {
      plan: `${plan.name} preview`,
      remainingGenerations: Math.max(0, plan.monthlyAiGenerations - 1),
    },
  });
}
