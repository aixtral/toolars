import { createRepurposeJob, validateRepurposeRequest } from '@/lib/ai';
import type { RepurposeRequest } from '@/lib/ai';

function hasPreviewAccount(request: Request) {
  return request.headers.get('x-toolars-preview-user') === 'true';
}

export async function POST(request: Request) {
  if (!hasPreviewAccount(request)) {
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

  const job = createRepurposeJob(body);

  return Response.json({
    job,
    usage: {
      plan: 'Pro preview',
      remainingGenerations: 48,
    },
  });
}
