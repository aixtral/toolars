import { createRepurposeJob, validateRepurposeRequest } from '@/lib/ai';
import type { RepurposeRequest } from '@/lib/ai';
import { getSession } from '@/lib/auth';
import { getPlanById } from '@/lib/plans';

export async function POST(request: Request) {
  const session = await getSession();
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

  // v1: AI generation is free for all logged-in users.
  const plan = getPlanById(session.planId);
  const job = createRepurposeJob(body);

  return Response.json({
    job,
    usage: {
      plan: `${plan.name} preview`,
      remainingGenerations: Math.max(0, plan.monthlyAiGenerations - 1),
    },
  });
}
