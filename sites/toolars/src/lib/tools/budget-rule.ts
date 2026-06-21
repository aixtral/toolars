export interface BudgetRuleInput {
  monthlyIncome: number;
  needsPercent: number;
  wantsPercent: number;
  savingsPercent: number;
}

export interface BudgetRuleResult {
  income: number;
  needsAmount: number;
  wantsAmount: number;
  savingsAmount: number;
  totalPercent: number;
  healthTone: "healthy" | "warning" | "low-savings";
  message: string;
  formattedIncome: string;
  formattedNeedsAmount: string;
  formattedWantsAmount: string;
  formattedSavingsAmount: string;
  summary: string;
}

export const defaultBudgetRuleScenario: BudgetRuleInput = {
  monthlyIncome: 5000,
  needsPercent: 50,
  wantsPercent: 30,
  savingsPercent: 20
};

export function calculateBudgetRule(input: BudgetRuleInput): BudgetRuleResult {
  const income = cleanNumber(input.monthlyIncome);
  const needsPercent = cleanNumber(input.needsPercent);
  const wantsPercent = cleanNumber(input.wantsPercent);
  const savingsPercent = cleanNumber(input.savingsPercent);
  const totalPercent = needsPercent + wantsPercent + savingsPercent;
  const needsAmount = (income * needsPercent) / 100;
  const wantsAmount = (income * wantsPercent) / 100;
  const savingsAmount = (income * savingsPercent) / 100;
  const healthTone = getHealthTone(totalPercent, savingsPercent);

  return {
    income,
    needsAmount,
    wantsAmount,
    savingsAmount,
    totalPercent,
    healthTone,
    message: getMessage(healthTone, totalPercent),
    formattedIncome: formatCurrency(income),
    formattedNeedsAmount: formatCurrency(needsAmount),
    formattedWantsAmount: formatCurrency(wantsAmount),
    formattedSavingsAmount: formatCurrency(savingsAmount),
    summary: `${needsPercent}% needs / ${wantsPercent}% wants / ${savingsPercent}% savings`
  };
}

function getHealthTone(totalPercent: number, savingsPercent: number): BudgetRuleResult["healthTone"] {
  if (Math.abs(totalPercent - 100) > 1) return "warning";
  if (savingsPercent >= 20) return "healthy";
  return "low-savings";
}

function getMessage(tone: BudgetRuleResult["healthTone"], totalPercent: number): string {
  if (tone === "warning") return `Total is ${totalPercent}%. Adjust to 100%.`;
  if (tone === "healthy") return "Healthy savings rate! Keep it up.";
  return "Savings rate is low. Try reducing non-essential spending.";
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
