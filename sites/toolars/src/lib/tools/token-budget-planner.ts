export type TokenBudgetStatus = "balanced" | "tight" | "over";

export interface TokenBudgetAllocationInput {
  label: string;
  tokens: number;
}

export interface TokenBudgetPlannerInput {
  totalBudget: number;
  allocations: TokenBudgetAllocationInput[];
}

export interface TokenBudgetAllocation {
  label: string;
  tokens: number;
  percent: number;
}

export interface TokenBudgetPlan {
  totalBudget: number;
  totalAllocated: number;
  remainingTokens: number;
  overBudgetTokens: number;
  status: TokenBudgetStatus;
  allocations: TokenBudgetAllocation[];
  warnings: string[];
  summary: string;
  privacyNote: string;
}

export function planTokenBudget(input: TokenBudgetPlannerInput): TokenBudgetPlan {
  const totalBudget = Math.max(1, Math.round(input.totalBudget));
  const allocations = input.allocations.map((allocation) => {
    const tokens = Math.max(0, Math.round(allocation.tokens));
    return {
      label: allocation.label.trim() || "Allocation",
      tokens,
      percent: Math.round((tokens / totalBudget) * 100)
    };
  });
  const totalAllocated = allocations.reduce((sum, allocation) => sum + allocation.tokens, 0);
  const remainingTokens = Math.max(0, totalBudget - totalAllocated);
  const overBudgetTokens = Math.max(0, totalAllocated - totalBudget);
  const status = overBudgetTokens > 0 ? "over" : remainingTokens / totalBudget < 0.05 ? "tight" : "balanced";
  const warnings = buildWarnings(status, allocations);

  return {
    totalBudget,
    totalAllocated,
    remainingTokens,
    overBudgetTokens,
    status,
    allocations,
    warnings,
    summary:
      status === "over"
        ? `${overBudgetTokens.toLocaleString("en-US")} tokens over budget.`
        : `${remainingTokens.toLocaleString("en-US")} tokens remaining.`,
    privacyNote: "Local token budgeting only; allocation notes stay in the browser."
  };
}

function buildWarnings(status: TokenBudgetStatus, allocations: TokenBudgetAllocation[]): string[] {
  const warnings: string[] = [];
  if (status === "over") warnings.push("Token plan exceeds the available context budget.");
  if (status === "tight") warnings.push("Token plan has less than 5% headroom.");
  if ((allocations.find((allocation) => /retrieval/i.test(allocation.label))?.percent ?? 0) > 60) {
    warnings.push("Retrieval uses most of the budget; consider chunk trimming before launch.");
  }
  return warnings;
}
