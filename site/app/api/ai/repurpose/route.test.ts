import { afterEach, describe, expect, it } from 'vitest';
import { resetAiPreviewRuntimeState } from '@/lib/ai/runtime-security';
import type { AiProviderAdapter } from '@/lib/ai';
import type { ToolarsSession } from '@/lib/auth';
import { readSecurityEvents, resetSecurityEvents } from '@/lib/security/events';
import {
  createInMemoryUsageMeterRepository,
  createMonthlyUsagePeriod,
  type UsageMeterRepository,
} from '@/lib/usage';
import { resetPreviewUsageMeterRepository } from '@/lib/usage/runtime';
import { POST, createAiRepurposeHandler } from './route';

const requestBody = {
  sourceType: 'text',
  sourceValue:
    'Turn the toolars calculator launch notes into platform-native content for a small business audience.',
  platforms: ['twitter-thread', 'linkedin-post'],
  tone: 'professional',
  brandVoiceId: 'founder',
  model: 'toolars-fast',
};

describe('POST /api/ai/repurpose', () => {
  afterEach(() => {
    resetAiPreviewRuntimeState();
    resetPreviewUsageMeterRepository();
    resetSecurityEvents();
  });

  function previewRequest(body: unknown, plan = 'pro') {
    return new Request('http://127.0.0.1/api/ai/repurpose', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-toolars-preview-user': 'true',
        'x-toolars-preview-plan': plan,
      },
      body: JSON.stringify(body),
    });
  }

  function productionRequest(body: unknown) {
    return new Request('http://127.0.0.1/api/ai/repurpose', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  const supabaseSession: ToolarsSession = {
    userId: 'user_123',
    email: 'founder@toolars.test',
    workspaceId: 'workspace_123',
    planId: 'pro',
    role: 'owner',
    isAuthenticated: true,
  };

  it('requires an account context before running AI generation', async () => {
    const response = await POST(
      new Request('http://127.0.0.1/api/ai/repurpose', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: 'Account required for AI repurposing.',
    });
    expect(readSecurityEvents()).toMatchObject([
      {
        route: '/api/ai/repurpose',
        category: 'ai',
        action: 'missing_session',
        outcome: 'denied',
        status: 401,
      },
    ]);
  });

  it('returns output cards for authenticated preview users', async () => {
    const response = await POST(previewRequest(requestBody));

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.job.status).toBe('completed');
    expect(body.job.outputs).toHaveLength(2);
    expect(body.job.provider).toMatchObject({
      id: 'preview',
      model: 'toolars-fast',
      usage: {
        latencyMs: expect.any(Number),
        totalTokens: expect.any(Number),
      },
    });
  });

  it('uses a Supabase-backed production session for AI generation', async () => {
    const usageRepository = createInMemoryUsageMeterRepository();
    const now = new Date('2026-06-15T00:00:00.000Z');
    const handler = createAiRepurposeHandler({
      usageRepository,
      now: () => now,
      resolveSession: async () => supabaseSession,
    });

    const response = await handler(productionRequest(requestBody));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.job.status).toBe('completed');
    await expect(
      usageRepository.readUsageSnapshot({
        workspaceId: 'workspace_123',
        period: createMonthlyUsagePeriod(now),
      }),
    ).resolves.toMatchObject({
      aiGenerationsUsed: 1,
    });
  });

  it('increments workspace usage only after successful generation', async () => {
    const usageRepository = createInMemoryUsageMeterRepository();
    const now = new Date('2026-06-15T00:00:00.000Z');
    const handler = createAiRepurposeHandler({
      usageRepository,
      now: () => now,
    });

    const response = await handler(previewRequest(requestBody));
    const body = await response.json();
    const period = createMonthlyUsagePeriod(now);

    expect(response.status).toBe(200);
    expect(body.usage).toMatchObject({
      plan: 'Pro preview',
      remainingGenerations: 999,
    });
    await expect(
      usageRepository.readUsageSnapshot({
        workspaceId: 'preview-pro-workspace',
        period,
      }),
    ).resolves.toMatchObject({
      aiGenerationsUsed: 1,
    });
  });

  it('does not increment workspace usage when the provider fails', async () => {
    const usageRepository = createInMemoryUsageMeterRepository();
    const now = new Date('2026-06-15T00:00:00.000Z');
    const failedProvider: AiProviderAdapter = {
      id: 'preview',
      async generate(input) {
        return {
          jobId: input.jobId,
          status: 'failed',
          outputs: [],
          provider: {
            id: 'preview',
            model: input.request.model,
            usage: {
              latencyMs: 1,
            },
          },
          error: {
            code: 'provider_unavailable',
            message: 'Generation service is unavailable. Try again.',
          },
        };
      },
      async *stream() {},
    };
    const handler = createAiRepurposeHandler({
      usageRepository,
      provider: failedProvider,
      now: () => now,
    });
    const period = createMonthlyUsagePeriod(now);

    const response = await handler(previewRequest(requestBody));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: 'Generation service is unavailable. Try again.',
    });
    await expect(
      usageRepository.readUsageSnapshot({
        workspaceId: 'preview-pro-workspace',
        period,
      }),
    ).resolves.toMatchObject({
      aiGenerationsUsed: 0,
    });
  });

  it('denies AI generation when durable usage reaches the plan limit', async () => {
    const now = new Date('2026-06-15T00:00:00.000Z');
    const usageRepository: UsageMeterRepository = {
      async readUsageSnapshot({ workspaceId, period }) {
        return {
          workspaceId,
          period,
          aiGenerationsUsed: 1000,
          exportsUsed: 0,
          batchRunsUsed: 0,
        };
      },
      async incrementAiGenerations() {
        throw new Error('plan-denied requests must not increment usage');
      },
      reset() {},
    };
    const handler = createAiRepurposeHandler({
      usageRepository,
      now: () => now,
    });

    const response = await handler(previewRequest(requestBody));

    expect(response.status).toBe(402);
    expect(await response.json()).toEqual({
      error: 'Pro monthly AI generation limit reached.',
      upgradeLabel: 'Upgrade to Pro',
    });
  });

  it('rejects oversized request bodies before generation', async () => {
    const response = await POST(
      previewRequest({
        ...requestBody,
        sourceValue: 'x'.repeat(13_000),
      }),
    );

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({
      error: 'AI request body is too large.',
    });
  });

  it('returns validation errors for malformed request shapes', async () => {
    const response = await POST(
      previewRequest({
        ...requestBody,
        sourceValue: 42,
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      errors: ['Add a URL or source text.'],
    });
  });

  it('returns validation errors for source text over the route limit', async () => {
    const response = await POST(
      previewRequest({
        ...requestBody,
        sourceValue: 'a'.repeat(6_001),
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      errors: ['Source text must be 6,000 characters or fewer.'],
    });
  });

  it('deduplicates selected platforms before plan gate and generation', async () => {
    const response = await POST(
      previewRequest({
        ...requestBody,
        platforms: ['twitter-thread', 'twitter-thread', 'linkedin-post'],
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.job.platforms).toEqual(['twitter-thread', 'linkedin-post']);
    expect(body.job.outputs).toHaveLength(2);
  });

  it('rate limits repeated preview requests for the same user', async () => {
    const responses = [];

    for (let index = 0; index < 6; index += 1) {
      responses.push(await POST(previewRequest(requestBody)));
    }

    const finalResponse = responses.at(-1);

    expect(responses.slice(0, 5).map((response) => response.status)).toEqual([
      200,
      200,
      200,
      200,
      200,
    ]);
    expect(finalResponse?.status).toBe(429);
    expect(await finalResponse?.json()).toEqual({
      error: 'Too many AI generation requests. Try again shortly.',
    });
  });

  it('logs plan denials without recording source text', async () => {
    const sourceValue = 'sensitive-ai-source-text-for-log-test';
    const usageRepository = createInMemoryUsageMeterRepository();
    const now = new Date('2026-06-15T00:00:00.000Z');
    const handler = createAiRepurposeHandler({
      usageRepository,
      now: () => now,
    });
    const response = await handler(
      previewRequest(
        {
          ...requestBody,
          sourceValue,
        },
        'free',
      ),
    );
    const period = createMonthlyUsagePeriod(now);

    expect(response.status).toBe(402);
    expect(readSecurityEvents()).toMatchObject([
      {
        route: '/api/ai/repurpose',
        category: 'ai',
        action: 'plan_denied',
        outcome: 'denied',
        status: 402,
        metadata: {
          planId: 'free',
          selectedPlatformCount: 2,
          userId: 'preview-free-user',
        },
      },
    ]);
    expect(JSON.stringify(readSecurityEvents())).not.toContain(sourceValue);
    await expect(
      usageRepository.readUsageSnapshot({
        workspaceId: 'preview-free-workspace',
        period,
      }),
    ).resolves.toMatchObject({
      aiGenerationsUsed: 0,
    });
  });
});
