import { describe, expect, it } from 'vitest';
import { readAiProviderConfig, requireAiProviderConfig } from '@/lib/ai/provider-config';

describe('AI provider config', () => {
  it('defaults to preview provider without production model configuration', () => {
    expect(readAiProviderConfig({})).toEqual({
      provider: 'preview',
      model: 'toolars-fast',
      requestTimeoutMs: 30_000,
    });
  });

  it('requires a model when AI SDK provider is selected', () => {
    expect(() =>
      requireAiProviderConfig({
        TOOLARS_AI_PROVIDER: 'ai-sdk',
      }),
    ).toThrow(/TOOLARS_AI_DEFAULT_MODEL/);

    expect(
      requireAiProviderConfig({
        TOOLARS_AI_PROVIDER: 'ai-sdk',
        TOOLARS_AI_DEFAULT_MODEL: 'openai/gpt-5.4',
        TOOLARS_AI_REQUEST_TIMEOUT_MS: '45000',
      }),
    ).toEqual({
      provider: 'ai-sdk',
      model: 'openai/gpt-5.4',
      requestTimeoutMs: 45_000,
    });
  });
});
