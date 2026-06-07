import { AI_BRAND_VOICES, AI_PLATFORMS } from '@/lib/ai';
import type { AiProviderAdapter, AiProviderError, AiProviderUsage } from '../provider';
import type { RepurposeOutput, RepurposeRequest } from '@/lib/ai';

// from https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text (AI SDK 6.x)
import { generateText } from 'ai';

export interface AiSdkGenerateTextInput {
  model: string;
  system: string;
  prompt: string;
  abortSignal?: AbortSignal;
  timeout?: number;
}

export interface AiSdkGenerateTextResult {
  text: string;
  finishReason?: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  providerRequestId?: string;
}

export type AiSdkGenerateTextExecutor = (
  input: AiSdkGenerateTextInput,
) => Promise<AiSdkGenerateTextResult>;

export interface CreateAiSdkProviderInput {
  model: string;
  requestTimeoutMs?: number;
  executeGenerateText?: AiSdkGenerateTextExecutor;
}

const safeProviderMessages: Record<AiProviderError['code'], string> = {
  provider_unavailable: 'Generation service is unavailable. Try again.',
  provider_rate_limited: 'Generation is busy. Try again shortly.',
  provider_timeout: 'Generation timed out. Retry.',
  provider_refusal: 'The model could not generate this request safely.',
  invalid_provider_config: 'Generation service is not configured.',
};

function nowIso() {
  return new Date().toISOString();
}

function wordCount(content: string) {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

function normalizeUsage(
  usage: AiSdkGenerateTextResult['usage'] | undefined,
  latencyMs: number,
): AiProviderUsage {
  return {
    inputTokens: usage?.inputTokens,
    outputTokens: usage?.outputTokens,
    totalTokens:
      usage?.totalTokens ??
      (usage?.inputTokens !== undefined && usage?.outputTokens !== undefined
        ? usage.inputTokens + usage.outputTokens
        : undefined),
    latencyMs,
  };
}

function buildSystemPrompt() {
  return [
    'You are Toolars AI, a practical content repurposing assistant.',
    'Return concise, platform-native drafts.',
    'Do not mention private implementation details or provider configuration.',
  ].join(' ');
}

function platformLabel(platformId: string) {
  return AI_PLATFORMS.find((platform) => platform.id === platformId)?.label ?? platformId;
}

function buildUserPrompt(request: RepurposeRequest) {
  const voice = AI_BRAND_VOICES.find((item) => item.id === request.brandVoiceId);
  const platforms = request.platforms.map(platformLabel).join(', ');

  return [
    `Tone: ${request.tone}.`,
    `Brand voice: ${voice?.label ?? request.brandVoiceId}.`,
    `Create outputs for: ${platforms}.`,
    `Source type: ${request.sourceType}.`,
    `Source: ${request.sourceValue}`,
    'Separate each platform draft with a blank line.',
  ].join('\n');
}

function splitGeneratedText(text: string, expectedCount: number) {
  const chunks = text
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (chunks.length >= expectedCount) return chunks.slice(0, expectedCount);
  return Array.from({ length: expectedCount }, (_, index) => chunks[index] ?? text.trim());
}

function outputsFromGeneratedText(request: RepurposeRequest, text: string): RepurposeOutput[] {
  const createdAt = nowIso();
  const chunks = splitGeneratedText(text, request.platforms.length);

  return request.platforms.map((platform, index) => {
    const label = platformLabel(platform);
    const content = chunks[index] || `${label}: ${text.trim()}`;

    return {
      id: `${platform}-${createdAt}`,
      platform,
      platformLabel: label,
      tone: request.tone,
      content,
      wordCount: wordCount(content),
      status: 'completed',
      createdAt,
    };
  });
}

async function defaultExecuteGenerateText({
  model,
  system,
  prompt,
  abortSignal,
  timeout,
}: AiSdkGenerateTextInput): Promise<AiSdkGenerateTextResult> {
  const result = await generateText({
    model,
    system,
    prompt,
    abortSignal,
    timeout,
  });

  return {
    text: result.text,
    finishReason: result.finishReason,
    usage: {
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      totalTokens: result.usage.totalTokens,
    },
    providerRequestId: result.response?.id,
  };
}

export function normalizeAiProviderError(error: unknown): AiProviderError {
  const message = error instanceof Error ? error.message.toLowerCase() : '';

  if (message.includes('429') || message.includes('rate limit')) {
    return {
      code: 'provider_rate_limited',
      message: safeProviderMessages.provider_rate_limited,
    };
  }

  if (message.includes('timeout') || message.includes('aborted')) {
    return {
      code: 'provider_timeout',
      message: safeProviderMessages.provider_timeout,
    };
  }

  if (message.includes('refusal') || message.includes('content-filter')) {
    return {
      code: 'provider_refusal',
      message: safeProviderMessages.provider_refusal,
    };
  }

  if (message.includes('api key') || message.includes('model')) {
    return {
      code: 'invalid_provider_config',
      message: safeProviderMessages.invalid_provider_config,
    };
  }

  return {
    code: 'provider_unavailable',
    message: safeProviderMessages.provider_unavailable,
  };
}

export function createAiSdkProvider({
  model,
  requestTimeoutMs = 30_000,
  executeGenerateText = defaultExecuteGenerateText,
}: CreateAiSdkProviderInput): AiProviderAdapter {
  return {
    id: 'ai-sdk',
    async generate(input) {
      const startedAt = Date.now();

      try {
        const result = await executeGenerateText({
          model,
          system: buildSystemPrompt(),
          prompt: buildUserPrompt(input.request),
          abortSignal: input.abortSignal,
          timeout: requestTimeoutMs,
        });
        const latencyMs = Math.max(0, Date.now() - startedAt);

        return {
          jobId: input.jobId,
          status: result.finishReason === 'content-filter' ? 'failed' : 'completed',
          outputs: outputsFromGeneratedText(input.request, result.text),
          provider: {
            id: 'ai-sdk',
            model,
            providerRequestId: result.providerRequestId,
            usage: normalizeUsage(result.usage, latencyMs),
          },
          error:
            result.finishReason === 'content-filter'
              ? {
                  code: 'provider_refusal',
                  message: safeProviderMessages.provider_refusal,
                }
              : undefined,
        };
      } catch (error) {
        return {
          jobId: input.jobId,
          status: 'failed',
          outputs: [],
          provider: {
            id: 'ai-sdk',
            model,
            usage: {
              latencyMs: Math.max(0, Date.now() - startedAt),
            },
          },
          error: normalizeAiProviderError(error),
        };
      }
    },
    async *stream(input) {
      yield {
        type: 'job_started' as const,
        jobId: input.jobId,
      };

      const result = await this.generate(input);

      if (result.status === 'failed') {
        yield {
          type: 'job_failed' as const,
          jobId: input.jobId,
          errorCode: result.error?.code ?? 'provider_unavailable',
        };
        return;
      }

      for (const output of result.outputs) {
        yield {
          type: 'output_completed' as const,
          jobId: input.jobId,
          platformId: output.platform,
          content: output.content,
        };
      }

      yield {
        type: 'job_completed' as const,
        jobId: input.jobId,
      };
    },
  };
}
