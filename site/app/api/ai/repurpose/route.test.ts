import { afterEach, describe, expect, it } from 'vitest';
import { resetAiPreviewRuntimeState } from '@/lib/ai/runtime-security';
import { readSecurityEvents, resetSecurityEvents } from '@/lib/security/events';
import { POST } from './route';

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
    const response = await POST(
      previewRequest(
        {
          ...requestBody,
          sourceValue,
        },
        'free',
      ),
    );

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
  });
});
