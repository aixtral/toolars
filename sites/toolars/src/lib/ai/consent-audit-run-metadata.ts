import type { AiProviderRoute } from "./provider-routing";

export type AiConsentRunStatus = "consent-approved" | "provider-completed" | "provider-failed";

export interface AiConsentRunUsage {
  costUsdCents: number;
  credits: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface AiConsentRunMetadata {
  completedAt?: string;
  contentBytes: number;
  createdAt: string;
  failedAt?: string;
  failureReason?: string;
  modelId?: string;
  modelFamily: string;
  providerRunId?: string;
  providerRouteId: string;
  retentionDays: number;
  runId: string;
  status: AiConsentRunStatus;
  stepId: string;
  usage?: AiConsentRunUsage;
  workflowSlug: string;
}

export function buildAiConsentRunMetadata({
  approvedAt,
  contentSummary,
  providerRoute
}: {
  approvedAt: string;
  contentSummary: string;
  providerRoute: AiProviderRoute;
}): AiConsentRunMetadata {
  return {
    contentBytes: new TextEncoder().encode(contentSummary).byteLength,
    createdAt: approvedAt,
    modelFamily: providerRoute.modelFamily,
    providerRouteId: providerRoute.providerRouteId,
    retentionDays: providerRoute.retentionDays,
    runId: `run_${providerRoute.workflowSlug}_${providerRoute.stepId}_${formatRunTimestamp(approvedAt)}`,
    status: "consent-approved",
    stepId: providerRoute.stepId,
    workflowSlug: providerRoute.workflowSlug
  };
}

function formatRunTimestamp(value: string) {
  return value.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
