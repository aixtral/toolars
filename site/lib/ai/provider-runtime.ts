import { createPreviewAiProvider } from '@/lib/ai';
import { requireAiProviderConfig } from './provider-config';
import type { AiProviderAdapter } from './provider';
import { createAiSdkProvider } from './providers/ai-sdk';

export function createConfiguredAiProvider(
  env: NodeJS.ProcessEnv = process.env,
): AiProviderAdapter {
  const config = requireAiProviderConfig(env);

  if (config.provider === 'ai-sdk') {
    return createAiSdkProvider({
      model: config.model,
      requestTimeoutMs: config.requestTimeoutMs,
    });
  }

  return createPreviewAiProvider();
}
