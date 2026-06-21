export interface SavingsGoalInput {
  goalAmount: number;
  currentSavings: number;
  monthlySavings: number;
  annualReturnRate: number;
}

export interface SavingsGoalResult {
  monthsToGoal: number;
  timeLabel: string;
  totalContributions: number;
  interestEarned: number;
  finalAmount: number;
  formattedTotalContributions: string;
  formattedInterestEarned: string;
  formattedFinalAmount: string;
  formattedGoalAmount: string;
  summary: string;
}

export const defaultSavingsGoalScenario: SavingsGoalInput = {
  goalAmount: 50000,
  currentSavings: 10000,
  monthlySavings: 500,
  annualReturnRate: 5
};

export function calculateSavingsGoal(input: SavingsGoalInput): SavingsGoalResult {
  const goalAmount = cleanNumber(input.goalAmount);
  const currentSavings = cleanNumber(input.currentSavings);
  const monthlySavings = cleanNumber(input.monthlySavings);
  const monthlyReturnRate = cleanNumber(input.annualReturnRate) / 100 / 12;
  let balance = currentSavings;
  let monthsToGoal = 0;
  let totalContributions = currentSavings;

  while (balance < goalAmount && monthsToGoal < 600) {
    monthsToGoal += 1;
    balance = balance * (1 + monthlyReturnRate) + monthlySavings;
    totalContributions += monthlySavings;
  }

  const interestEarned = Math.max(0, balance - totalContributions);
  const didReachGoal = balance >= goalAmount;

  return {
    monthsToGoal,
    timeLabel: didReachGoal ? `${monthsToGoal} months` : "50+ years",
    totalContributions,
    interestEarned,
    finalAmount: balance,
    formattedTotalContributions: formatCurrency(totalContributions),
    formattedInterestEarned: formatCurrency(interestEarned),
    formattedFinalAmount: formatCurrency(balance),
    formattedGoalAmount: formatCurrency(goalAmount),
    summary: `${formatCurrency(goalAmount)} goal with ${formatCurrency(monthlySavings)}/month`
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
