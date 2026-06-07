import { describe, expect, it } from 'vitest';
import {
  createPreviewAiProvider,
  generateRepurposeJobWithProvider,
} from '@/lib/ai';
import type { RepurposeRequest } from '@/lib/ai';

const request: RepurposeRequest = {
  sourceType: 'text',
  sourceValue:
    'Toolars combines free calculator workflows with account-based AI repurposing for operators who need quick launch content.',
  platforms: ['twitter-thread', 'linkedin-post'],
  tone: 'professional',
  brandVoiceId: 'founder',
  model: 'toolars-fast',
};

describe('AI provider adapter service', () => {
  it('generates deterministic preview outputs through the provider-neutral service', async () => {
    const job = await generateRepurposeJobWithProvider({
      request,
      session: {
        userId: 'user_123',
        email: 'founder@toolars.test',
        workspaceId: 'workspace_123',
        planId: 'pro',
        role: 'owner',
        isAuthenticated: true,
      },
      provider: createPreviewAiProvider(),
    });

    expect(job.status).toBe('completed');
    expect(job.outputs).toHaveLength(2);
    expect(job.provider).toMatchObject({
      id: 'preview',
      model: 'toolars-fast',
      usage: {
        latencyMs: expect.any(Number),
        inputTokens: expect.any(Number),
        outputTokens: expect.any(Number),
        totalTokens: expect.any(Number),
      },
    });
    expect(job.outputs[0].content).toContain('Twitter Thread');
  });

  it('exposes a preview stream lifecycle without external network calls', async () => {
    const chunks = [];

    for await (const chunk of createPreviewAiProvider().stream({
      jobId: 'job_123',
      userId: 'user_123',
      workspaceId: 'workspace_123',
      request,
    })) {
      chunks.push(chunk);
    }

    expect(chunks.map((chunk) => chunk.type)).toEqual([
      'job_started',
      'output_completed',
      'output_completed',
      'job_completed',
    ]);
    expect(chunks.at(-1)).toMatchObject({
      type: 'job_completed',
      jobId: 'job_123',
    });
  });
});
