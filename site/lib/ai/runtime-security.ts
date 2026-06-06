import type { RepurposeRequest } from '@/lib/ai';

export const MAX_REPURPOSE_REQUEST_BYTES = 12_000;
export const MAX_REPURPOSE_SOURCE_CHARACTERS = 6_000;
export const AI_PREVIEW_RATE_LIMIT = 5;
const previewWindowMs = 60_000;

interface PreviewRuntimeState {
  requestTimestamps: number[];
  successfulGenerations: number;
}

const previewRuntimeState = new Map<string, PreviewRuntimeState>();

export interface AiRuntimeGuardDecision {
  allowed: boolean;
  status: number;
  error: string;
}

export interface AiPreviewRuntimeSnapshot {
  usedGenerations: number;
}

function stateFor(userId: string) {
  const existing = previewRuntimeState.get(userId);
  if (existing) return existing;

  const nextState: PreviewRuntimeState = {
    requestTimestamps: [],
    successfulGenerations: 0,
  };
  previewRuntimeState.set(userId, nextState);
  return nextState;
}

export function resetAiPreviewRuntimeState() {
  previewRuntimeState.clear();
}

export function evaluateAiPreviewRuntimeGuard(
  userId: string,
  now = Date.now(),
): AiRuntimeGuardDecision {
  const state = stateFor(userId);
  const windowStart = now - previewWindowMs;
  state.requestTimestamps = state.requestTimestamps.filter(
    (timestamp) => timestamp > windowStart,
  );

  if (state.requestTimestamps.length >= AI_PREVIEW_RATE_LIMIT) {
    return {
      allowed: false,
      status: 429,
      error: 'Too many AI generation requests. Try again shortly.',
    };
  }

  state.requestTimestamps.push(now);
  return {
    allowed: true,
    status: 200,
    error: '',
  };
}

export function readAiPreviewRuntimeSnapshot(userId: string): AiPreviewRuntimeSnapshot {
  return {
    usedGenerations: stateFor(userId).successfulGenerations,
  };
}

export function recordAiPreviewGeneration(userId: string) {
  stateFor(userId).successfulGenerations += 1;
}

export async function readBoundedRequestBody(request: Request) {
  const body = await request.text();

  if (new TextEncoder().encode(body).length > MAX_REPURPOSE_REQUEST_BYTES) {
    return {
      ok: false as const,
      error: 'AI request body is too large.',
      status: 413,
    };
  }

  return {
    ok: true as const,
    body,
  };
}

export function normalizeRepurposeRequest(payload: unknown) {
  const errors: string[] = [];

  if (!payload || typeof payload !== 'object') {
    return {
      errors: ['Add a URL or source text.'],
      request: undefined,
    };
  }

  const input = payload as Record<string, unknown>;
  const sourceType = input.sourceType;
  const sourceValue = input.sourceValue;
  const platforms = input.platforms;
  const tone = input.tone;
  const brandVoiceId = input.brandVoiceId;
  const model = input.model;

  if (sourceValue !== undefined && typeof sourceValue !== 'string') {
    errors.push('Add a URL or source text.');
  }

  if (typeof sourceValue === 'string' && sourceValue.length > MAX_REPURPOSE_SOURCE_CHARACTERS) {
    errors.push('Source text must be 6,000 characters or fewer.');
  }

  const uniquePlatforms =
    Array.isArray(platforms)
      ? platforms.filter(
          (platform, index, allPlatforms) =>
            typeof platform === 'string' && allPlatforms.indexOf(platform) === index,
        )
      : [];

  if (errors.length > 0) {
    return {
      errors,
      request: undefined,
    };
  }

  const request = {
    sourceType,
    sourceValue,
    platforms: uniquePlatforms,
    tone,
    brandVoiceId,
    model,
  } as RepurposeRequest;

  return {
    errors,
    request,
  };
}
