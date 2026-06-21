export interface HomeAffordabilityInput {
  monthlyHouseholdIncome: number;
  existingMonthlyDebt: number;
  downPaymentRatio: number;
  annualInterestRate: number;
  loanTermYears: number;
  dtiLimit: number;
}

export interface HomeAffordabilityResult {
  maxMonthlyPayment: number;
  loanAmount: number;
  maxPrice: number;
  downPayment: number;
  dtiRatio: number;
  statusTone: "healthy" | "strained" | "blocked";
  statusTitle: string;
  guidance: string;
  formattedMaxPrice: string;
  formattedMonthlyPayment: string;
  formattedLoanAmount: string;
  formattedDownPayment: string;
  formattedDtiRatio: string;
  summary: string;
}

export const defaultHomeAffordabilityScenario: HomeAffordabilityInput = {
  monthlyHouseholdIncome: 20000,
  existingMonthlyDebt: 0,
  downPaymentRatio: 0.3,
  annualInterestRate: 3.8,
  loanTermYears: 30,
  dtiLimit: 0.35
};

export function calculateHomeAffordability(input: HomeAffordabilityInput): HomeAffordabilityResult {
  const monthlyHouseholdIncome = cleanNumber(input.monthlyHouseholdIncome);
  const existingMonthlyDebt = cleanNumber(input.existingMonthlyDebt);
  const downPaymentRatio = clamp(cleanNumber(input.downPaymentRatio), 0, 0.95);
  const annualInterestRate = cleanNumber(input.annualInterestRate);
  const loanTermYears = Math.max(1, cleanNumber(input.loanTermYears));
  const dtiLimit = clamp(cleanNumber(input.dtiLimit), 0, 1);
  const monthCount = loanTermYears * 12;
  const monthlyRate = annualInterestRate / 100 / 12;
  const maxMonthlyPayment = monthlyHouseholdIncome * dtiLimit - existingMonthlyDebt;

  if (maxMonthlyPayment <= 0 || monthlyHouseholdIncome <= 0) {
    return buildHomeAffordabilityResult({
      maxMonthlyPayment: 0,
      loanAmount: 0,
      maxPrice: 0,
      downPayment: 0,
      dtiRatio: 0,
      statusTone: "blocked",
      statusTitle: "Income constrained",
      guidance: "Existing monthly debt already exceeds the selected debt-to-income limit."
    });
  }

  const loanAmount =
    monthlyRate === 0
      ? maxMonthlyPayment * monthCount
      : maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -monthCount)) / monthlyRate);
  const maxPrice = loanAmount / (1 - downPaymentRatio);
  const downPayment = maxPrice * downPaymentRatio;
  const dtiRatio = ((maxMonthlyPayment + existingMonthlyDebt) / monthlyHouseholdIncome) * 100;
  const statusTone = dtiRatio <= 36 ? "healthy" : "strained";

  return buildHomeAffordabilityResult({
    maxMonthlyPayment,
    loanAmount,
    maxPrice,
    downPayment,
    dtiRatio,
    statusTone,
    statusTitle: statusTone === "healthy" ? "Financially healthy" : "Debt load elevated",
    guidance:
      statusTone === "healthy"
        ? "The selected payment stays inside the common 36% total-debt benchmark."
        : "Consider lowering the price target, increasing the down payment, or reducing existing debt."
  });
}

function buildHomeAffordabilityResult(input: {
  maxMonthlyPayment: number;
  loanAmount: number;
  maxPrice: number;
  downPayment: number;
  dtiRatio: number;
  statusTone: "healthy" | "strained" | "blocked";
  statusTitle: string;
  guidance: string;
}): HomeAffordabilityResult {
  return {
    ...input,
    formattedMaxPrice: formatYuan(input.maxPrice),
    formattedMonthlyPayment: formatYuan(input.maxMonthlyPayment),
    formattedLoanAmount: formatYuan(input.loanAmount),
    formattedDownPayment: formatYuan(input.downPayment),
    formattedDtiRatio: input.maxMonthlyPayment > 0 ? `${input.dtiRatio.toFixed(1)}%` : "--",
    summary:
      input.maxMonthlyPayment > 0
        ? `${formatYuan(input.maxPrice)} max price with ${formatYuan(input.maxMonthlyPayment)} monthly payment`
        : "Existing debt leaves no affordable mortgage payment under this DTI limit"
  };
}

function formatYuan(value: number) {
  const rounded = Math.round(Math.max(0, value));
  if (rounded >= 10000) return `¥${(rounded / 10000).toFixed(1)}万`;
  return `¥${rounded.toLocaleString("en-US")}`;
}

function cleanNumber(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
