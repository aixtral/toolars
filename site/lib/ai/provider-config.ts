import type { AiProviderId } from './provider';

export interface AiProviderConfig {
  provider: AiProviderId;
  model: string;
  requestTimeoutMs: number;
}

type EnvRecord = Partial<Record<string, string | undefined>>;

function cleanValue(value: string | undefined) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
}

function readTimeoutMs(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30_000;
}

function providerFromEnv(value: string | undefined): AiProviderId {
  if (value === 'ai-sdk') return 'ai-sdk';
  return 'preview';
}

function isProductionEnvironment(env: EnvRecord) {
  return env.NODE_ENV === 'production';
}

export function readAiProviderConfig(env: EnvRecord = process.env): AiProviderConfig {
  const provider = providerFromEnv(cleanValue(env.TOOLARS_AI_PROVIDER));
  const model = cleanValue(env.TOOLARS_AI_DEFAULT_MODEL) ?? 'toolars-fast';

  return {
    provider,
    model,
    requestTimeoutMs: readTimeoutMs(env.TOOLARS_AI_REQUEST_TIMEOUT_MS),
  };
}

export function requireAiProviderConfig(
  env: EnvRecord = process.env,
): AiProviderConfig {
  const config = readAiProviderConfig(env);

  if (isProductionEnvironment(env) && config.provider !== 'ai-sdk') {
    throw new Error('TOOLARS_AI_PROVIDER=ai-sdk is required when NODE_ENV=production.');
  }

  if (config.provider === 'ai-sdk' && !cleanValue(env.TOOLARS_AI_DEFAULT_MODEL)) {
    throw new Error(
      'TOOLARS_AI_DEFAULT_MODEL is required when TOOLARS_AI_PROVIDER=ai-sdk.',
    );
  }

  return config;
}
