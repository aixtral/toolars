export type ModelComparatorQualityTarget = "balanced" | "high";

export interface ModelComparatorInput {
  inputTokens: number;
  outputTokens: number;
  latencyTargetMs: number;
  qualityTarget: ModelComparatorQualityTarget;
}

export interface ModelProfile {
  key: string;
  label: string;
  contextWindow: number;
  costPerThousandTokens: number;
  latencyMs: number;
  quality: ModelComparatorQualityTarget;
}

export interface ModelComparisonRow {
  model: ModelProfile;
  fitScore: number;
  contextFits: boolean;
  estimatedCost: number;
  formattedEstimatedCost: string;
}

export interface ModelComparatorResult {
  rows: ModelComparisonRow[];
  recommendedModel: ModelProfile;
  warnings: string[];
  summary: string;
  privacyNote: string;
}

export const modelComparatorProfiles: ModelProfile[] = [
  { key: "gpt-4o-mini", label: "GPT-4o mini", contextWindow: 128000, costPerThousandTokens: 0.00015, latencyMs: 650, quality: "balanced" },
  { key: "gpt-4o", label: "GPT-4o", contextWindow: 128000, costPerThousandTokens: 0.005, latencyMs: 900, quality: "high" },
  { key: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet", contextWindow: 200000, costPerThousandTokens: 0.003, latencyMs: 1200, quality: "high" },
  { key: "llama-3-1-70b", label: "Llama 3.1 70B", contextWindow: 128000, costPerThousandTokens: 0.0005, latencyMs: 1800, quality: "balanced" }
];

export function compareModelProfiles(input: ModelComparatorInput): ModelComparatorResult {
  const totalTokens = Math.max(0, Math.round(input.inputTokens + input.outputTokens));
  const rows = modelComparatorProfiles
    .map((model) => buildRow(model, totalTokens, input))
    .sort((a, b) => b.fitScore - a.fitScore || a.estimatedCost - b.estimatedCost);
  const recommendedModel = rows[0].model;
  const warnings = rows.some((row) => !row.contextFits) ? ["Some models cannot fit the requested context window."] : [];

  return {
    rows,
    recommendedModel,
    warnings,
    summary: `${recommendedModel.label} recommended for this workload.`,
    privacyNote: "Local model comparison only; workload assumptions stay in the browser."
  };
}

function buildRow(model: ModelProfile, totalTokens: number, input: ModelComparatorInput): ModelComparisonRow {
  const contextFits = totalTokens <= model.contextWindow;
  const estimatedCost = (totalTokens / 1000) * model.costPerThousandTokens;
  const fitScore =
    (contextFits ? 40 : -20) +
    (model.latencyMs <= input.latencyTargetMs ? 20 : 8) +
    getQualityScore(model.quality, input.qualityTarget) +
    getCostScore(model.costPerThousandTokens);

  return {
    model,
    fitScore,
    contextFits,
    estimatedCost,
    formattedEstimatedCost: `$${estimatedCost.toFixed(6)}`
  };
}

function getQualityScore(modelQuality: ModelComparatorQualityTarget, target: ModelComparatorQualityTarget): number {
  if (target === "balanced") return modelQuality === "balanced" ? 25 : 18;
  return modelQuality === "high" ? 25 : 15;
}

function getCostScore(costPerThousandTokens: number): number {
  if (costPerThousandTokens <= 0.0002) return 20;
  if (costPerThousandTokens <= 0.001) return 15;
  if (costPerThousandTokens <= 0.003) return 10;
  return 5;
}
