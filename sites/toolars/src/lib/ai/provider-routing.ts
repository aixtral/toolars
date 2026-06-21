export interface AiProviderRoute {
  contentScope: string;
  fallbackRouteId: string;
  modelFamily: string;
  providerLabel: string;
  providerRouteId: string;
  requiresConsent: boolean;
  retentionDays: number;
  stepId: string;
  workflowSlug: string;
}

interface SelectAiProviderRouteInput {
  stepId: string;
  workflowSlug: string;
}

const pdfSummaryRoute: AiProviderRoute = {
  contentScope: "Only extracted text from the selected workflow step is sent to the model route.",
  fallbackRouteId: "local-extract-only:v1",
  modelFamily: "Fast summary model",
  providerLabel: "Toolars AI Gateway",
  providerRouteId: "pdf-summary.fast-summary:v1",
  requiresConsent: true,
  retentionDays: 30,
  stepId: "summarize-with-ai",
  workflowSlug: "pdf-summary"
};

export function selectAiProviderRoute(input: SelectAiProviderRouteInput): AiProviderRoute {
  if (input.workflowSlug === "pdf-summary" && input.stepId === "summarize-with-ai") {
    return pdfSummaryRoute;
  }

  return {
    ...pdfSummaryRoute,
    stepId: input.stepId,
    workflowSlug: input.workflowSlug
  };
}
