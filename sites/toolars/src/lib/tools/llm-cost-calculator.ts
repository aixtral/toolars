export type LlmCostProfileKey = "small" | "balanced" | "premium";

export interface LlmCostProfile {
  key: LlmCostProfileKey;
  label: string;
  inputPerMillion: number;
  outputPerMillion: number;
}

export interface LlmCostInput {
  inputTokensPerRequest: number;
  outputTokensPerRequest: number;
  requestsPerMonth: number;
  modelProfile: LlmCostProfileKey;
}

export interface LlmCostResult {
  modelLabel: string;
  inputTokensMonthly: number;
  outputTokensMonthly: number;
  totalTokensMonthly: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  formattedTotalCost: string;
  formattedMonthlyTokens: string;
  inputSharePercent: number;
  outputSharePercent: number;
  summary: string;
  recommendation: string;
}

export const llmCostProfiles: Record<LlmCostProfileKey, LlmCostProfile> = {
  small: {
    key: "small",
    label: "Small utility model",
    inputPerMillion: 0.15,
    outputPerMillion: 0.6
  },
  balanced: {
    key: "balanced",
    label: "Balanced model",
    inputPerMillion: 0.6,
    outputPerMillion: 2.4
  },
  premium: {
    key: "premium",
    label: "Premium reasoning model",
    inputPerMillion: 3,
    outputPerMillion: 12
  }
};

export function calculateLlmCost(input: LlmCostInput): LlmCostResult {
  const profile = llmCostProfiles[input.modelProfile] ?? llmCostProfiles.balanced;
  const inputTokensPerRequest = cleanNumber(input.inputTokensPerRequest);
  const outputTokensPerRequest = cleanNumber(input.outputTokensPerRequest);
  const requestsPerMonth = cleanNumber(input.requestsPerMonth);
  const inputTokensMonthly = inputTokensPerRequest * requestsPerMonth;
  const outputTokensMonthly = outputTokensPerRequest * requestsPerMonth;
  const totalTokensMonthly = inputTokensMonthly + outputTokensMonthly;
  const inputCost = (inputTokensMonthly / 1_000_000) * profile.inputPerMillion;
  const outputCost = (outputTokensMonthly / 1_000_000) * profile.outputPerMillion;
  const totalCost = inputCost + outputCost;
  const inputSharePercent = totalTokensMonthly > 0 ? Math.round((inputTokensMonthly / totalTokensMonthly) * 100) : 0;
  const outputSharePercent = totalTokensMonthly > 0 ? 100 - inputSharePercent : 0;

  return {
    modelLabel: profile.label,
    inputTokensMonthly,
    outputTokensMonthly,
    totalTokensMonthly,
    inputCost,
    outputCost,
    totalCost,
    formattedTotalCost: formatCurrency(totalCost),
    formattedMonthlyTokens: formatTokenVolume(totalTokensMonthly),
    inputSharePercent,
    outputSharePercent,
    summary: `${profile.label} - input ${formatCurrency(inputCost)} - output ${formatCurrency(outputCost)}`,
    recommendation: getRecommendation(totalCost)
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function formatTokenVolume(tokens: number): string {
  if (tokens >= 1_000_000_000) return `${Math.round(tokens / 1_000_000_000)}B`;
  return `${Math.round(tokens / 1_000_000)}M`;
}

function getRecommendation(monthlyCost: number): string {
  if (monthlyCost >= 1000) return "Require budget approval";
  if (monthlyCost >= 250) return "Review spend before production";
  return "Safe for launch estimate";
}
