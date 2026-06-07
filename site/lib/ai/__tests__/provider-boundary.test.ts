import { describe, expect, it } from 'vitest';
import { findForbiddenAiProviderImports } from '@/lib/ai/provider-boundary';

describe('AI provider import boundaries', () => {
  it('keeps AI SDK imports inside server-only provider modules', () => {
    expect(findForbiddenAiProviderImports()).toEqual([]);
  });
});
