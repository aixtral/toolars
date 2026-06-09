import type { PlanId } from '@/lib/plans';
import type {
  RepurposeJob,
  RepurposeOutput,
  RepurposePlatform,
  RepurposeRequest,
  RepurposeStatus,
} from './index';

export type AiProviderId = 'preview' | 'ai-sdk';

export type AiProviderErrorCode =
  | 'provider_unavailable'
  | 'provider_rate_limited'
  | 'provider_timeout'
  | 'provider_refusal'
  | 'invalid_provider_config';

export interface AiProviderUsage {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  estimatedCostUsd?: number;
  latencyMs: number;
}

export interface AiProviderMetadata {
  id: AiProviderId;
  model: string;
  providerRequestId?: string;
  usage: AiProviderUsage;
}

export interface AiProviderError {
  code: AiProviderErrorCode;
  message: string;
}

export interface AiGenerationInput {
  jobId: string;
  userId: string;
  workspaceId: string;
  request: RepurposeRequest;
  abortSignal?: AbortSignal;
}

export interface AiGenerationChunk {
  type:
    | 'job_started'
    | 'output_delta'
    | 'output_completed'
    | 'job_completed'
    | 'job_failed'
    | 'job_canceled';
  jobId: string;
  platformId?: RepurposePlatform;
  textDelta?: string;
  content?: string;
  errorCode?: AiProviderErrorCode;
}

export interface AiGenerationResult {
  jobId: string;
  status: RepurposeStatus;
  outputs: RepurposeOutput[];
  provider: AiProviderMetadata;
  error?: AiProviderError;
}

export interface AiProviderAdapter {
  id: AiProviderId;
  generate(input: AiGenerationInput): Promise<AiGenerationResult>;
  stream(input: AiGenerationInput): AsyncIterable<AiGenerationChunk>;
}

export interface AiGenerationSession {
  userId: string;
  email?: string | null;
  workspaceId: string;
  planId: PlanId;
  role?: 'owner' | 'admin' | 'member';
  isAuthenticated: true;
}

export type RepurposeJobWithProvider = RepurposeJob & {
  provider: AiProviderMetadata;
  error?: AiProviderError;
};
