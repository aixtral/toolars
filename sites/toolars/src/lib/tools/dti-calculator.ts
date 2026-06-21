export interface DtiInput {
  grossMonthlyIncome: number;
  mortgagePayment: number;
  otherMonthlyDebt: number;
  housingAddOns: number;
}

export interface DtiResult {
  frontEndDtiPercent: number;
  backEndDtiPercent: number;
  housingTotal: number;
  totalMonthlyPayments: number;
  disposableIncome: number;
  healthTone: "good" | "caution" | "high" | "missing";
  qualifyMessage: string;
  formattedTotalMonthlyPayments: string;
  formattedDisposableIncome: string;
  summary: string;
}

export const defaultDtiScenario: DtiInput = {
  grossMonthlyIncome: 8000,
  mortgagePayment: 2500,
  otherMonthlyDebt: 800,
  housingAddOns: 500
};

export function calculateDti(input: DtiInput): DtiResult {
  const grossMonthlyIncome = cleanNumber(input.grossMonthlyIncome);
  const housingTotal = cleanNumber(input.mortgagePayment) + cleanNumber(input.housingAddOns);
  const totalMonthlyPayments = housingTotal + cleanNumber(input.otherMonthlyDebt);
  const disposableIncome = Math.max(grossMonthlyIncome - totalMonthlyPayments, 0);

  if (grossMonthlyIncome <= 0) {
    return {
      frontEndDtiPercent: 0,
      backEndDtiPercent: 0,
      housingTotal,
      totalMonthlyPayments,
      disposableIncome: 0,
      healthTone: "missing",
      qualifyMessage: "Enter monthly income to calculate DTI.",
      formattedTotalMonthlyPayments: formatCurrency(totalMonthlyPayments),
      formattedDisposableIncome: formatCurrency(0),
      summary: "0.0% front-end / 0.0% back-end DTI"
    };
  }

  const frontEndDtiPercent = roundOne((housingTotal / grossMonthlyIncome) * 100);
  const backEndDtiPercent = roundOne((totalMonthlyPayments / grossMonthlyIncome) * 100);
  const healthTone = getHealthTone(backEndDtiPercent);

  return {
    frontEndDtiPercent,
    backEndDtiPercent,
    housingTotal,
    totalMonthlyPayments,
    disposableIncome,
    healthTone,
    qualifyMessage: getQualifyMessage(healthTone),
    formattedTotalMonthlyPayments: formatCurrency(totalMonthlyPayments),
    formattedDisposableIncome: formatCurrency(disposableIncome),
    summary: `${frontEndDtiPercent.toFixed(1)}% front-end / ${backEndDtiPercent.toFixed(1)}% back-end DTI`
  };
}

function getHealthTone(backEndDtiPercent: number): DtiResult["healthTone"] {
  if (backEndDtiPercent <= 36) return "good";
  if (backEndDtiPercent <= 43) return "caution";
  return "high";
}

function getQualifyMessage(tone: DtiResult["healthTone"]): string {
  if (tone === "good") return "Qualifies for conventional mortgage";
  if (tone === "caution") return "Qualifies for FHA; conventional may be limited";
  if (tone === "missing") return "Enter monthly income to calculate DTI.";
  return "DTI too high — reduce debt before applying";
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function roundOne(value: number): number {
  return Math.round(value * 10) / 10;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
