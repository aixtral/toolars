import { calculateLlmCost, type LlmCostInput } from "@/lib/tools/llm-cost-calculator";

export interface LlmCostReviewStep {
  title: string;
  description: string;
  badge: "Local";
}

export interface LlmCostReviewResult {
  progressPercent: number;
  statusTitle: string;
  monthlyCost: string;
  monthlyTokens: string;
  memo: string;
}

const defaultReviewScenario: LlmCostInput = {
  inputTokensPerRequest: 2400,
  outputTokensPerRequest: 700,
  requestsPerMonth: 180000,
  modelProfile: "balanced"
};

export function buildLlmCostReviewSteps(): LlmCostReviewStep[] {
  return [
    {
      title: "Count tokens",
      description: "Runs locally from static usage assumptions.",
      badge: "Local"
    },
    {
      title: "Compare models",
      description: "Compare cost, context, latency, and task fit.",
      badge: "Local"
    },
    {
      title: "Plan context",
      description: "Runs locally from static usage assumptions.",
      badge: "Local"
    },
    {
      title: "Export budget",
      description: "Runs locally from static usage assumptions.",
      badge: "Local"
    }
  ];
}

export function runLlmCostReviewWorkflow(input: LlmCostInput = defaultReviewScenario): LlmCostReviewResult {
  const estimate = calculateLlmCost(input);
  const monthlyCost = `${estimate.formattedTotalCost}/month`;
  const monthlyTokens = `${estimate.formattedMonthlyTokens} tokens`;

  return {
    progressPercent: 76,
    statusTitle: "Cost review ready",
    monthlyCost,
    monthlyTokens,
    memo: `Estimated ${monthlyCost}. Budget memo routes low-risk jobs to a smaller model and sets context caps before launch.`
  };
}
