import { describe, expect, it, vi } from 'vitest';
import { createAiSdkProvider, normalizeAiProviderError } from '@/lib/ai/providers/ai-sdk';
import type { RepurposeRequest } from '@/lib/ai';

const request: RepurposeRequest = {
  sourceType: 'text',
  sourceValue:
    'Toolars helps operators turn calculator outcomes and launch notes into useful content across multiple platforms.',
  platforms: ['linkedin-post', 'newsletter'],
  tone: 'professional',
  brandVoiceId: 'founder',
  model: 'toolars-balanced',
};

describe('AI SDK provider adapter', () => {
  it('uses an injectable executor to map generated text into platform outputs', async () => {
    const executeGenerateText = vi.fn(async () => ({
      text: [
        'LinkedIn Post: Share the operator outcome with a concise launch note.',
        'Newsletter: Explain the workflow, then invite readers to try Toolars.',
      ].join('\n\n'),
      finishReason: 'stop',
      usage: {
        inputTokens: 12,
        outputTokens: 24,
        totalTokens: 36,
      },
      providerRequestId: 'provider_req_123',
    }));

    const result = await createAiSdkProvider({
      model: 'openai/gpt-5.4',
      executeGenerateText,
    }).generate({
      jobId: 'job_123',
      userId: 'user_123',
      workspaceId: 'workspace_123',
      request,
    });

    expect(executeGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'openai/gpt-5.4',
        prompt: expect.stringContaining('LinkedIn Post'),
        system: expect.stringContaining('Toolars'),
      }),
    );
    expect(result).toMatchObject({
      jobId: 'job_123',
      status: 'completed',
      provider: {
        id: 'ai-sdk',
        model: 'openai/gpt-5.4',
        providerRequestId: 'provider_req_123',
        usage: {
          inputTokens: 12,
          outputTokens: 24,
          totalTokens: 36,
        },
      },
    });
    expect(result.outputs).toHaveLength(2);
    expect(result.outputs[0].platform).toBe('linkedin-post');
    expect(result.outputs[0].content).toContain('LinkedIn Post');
  });

  it('normalizes provider errors without exposing raw prompts or secrets', async () => {
    const error = normalizeAiProviderError(
      new Error('429 rate limit for sk-secret with private source text'),
    );

    expect(error).toEqual({
      code: 'provider_rate_limited',
      message: 'Generation is busy. Try again shortly.',
    });
    expect(JSON.stringify(error)).not.toContain('sk-secret');
    expect(JSON.stringify(error)).not.toContain('private source text');
  });
});
