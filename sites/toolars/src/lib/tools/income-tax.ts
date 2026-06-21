export interface IncomeTaxInput {
  monthlySalary: number;
  taxRate: number;
  monthlyDeduction: number;
  extraWithheld: number;
}

export interface IncomeTaxResult {
  monthlySalary: number;
  taxRate: number;
  monthlyDeduction: number;
  extraWithheld: number;
  taxableIncome: number;
  monthlyTax: number;
  monthlyDeductions: number;
  monthlyNetIncome: number;
  annualGrossIncome: number;
  annualTax: number;
  annualDeductions: number;
  annualNetIncome: number;
  effectiveRate: number;
  formattedMonthlyGrossIncome: string;
  formattedMonthlyTax: string;
  formattedMonthlyDeductions: string;
  formattedMonthlyNetIncome: string;
  formattedAnnualGrossIncome: string;
  formattedAnnualTax: string;
  formattedAnnualDeductions: string;
  formattedAnnualNetIncome: string;
  formattedEffectiveRate: string;
  summary: string;
}

export const defaultIncomeTaxScenario: IncomeTaxInput = {
  monthlySalary: 5000,
  taxRate: 20,
  monthlyDeduction: 500,
  extraWithheld: 300
};

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const monthlySalary = cleanNumber(input.monthlySalary);
  const taxRate = cleanNumber(input.taxRate);
  const monthlyDeduction = cleanNumber(input.monthlyDeduction);
  const extraWithheld = cleanNumber(input.extraWithheld);
  const taxableIncome = Math.max(0, monthlySalary - monthlyDeduction);
  const monthlyTax = taxableIncome * (taxRate / 100);
  const monthlyDeductions = monthlyDeduction + extraWithheld;
  const monthlyNetIncome = monthlySalary - monthlyTax - extraWithheld;
  const annualGrossIncome = monthlySalary * 12;
  const annualTax = monthlyTax * 12;
  const annualDeductions = monthlyDeductions * 12;
  const annualNetIncome = monthlyNetIncome * 12;
  const effectiveRate = monthlySalary > 0 ? monthlyTax / monthlySalary * 100 : 0;
  const formattedMonthlyNetIncome = formatCurrency(monthlyNetIncome);
  const formattedMonthlyGrossIncome = formatCurrency(monthlySalary);

  return {
    monthlySalary,
    taxRate,
    monthlyDeduction,
    extraWithheld,
    taxableIncome,
    monthlyTax,
    monthlyDeductions,
    monthlyNetIncome,
    annualGrossIncome,
    annualTax,
    annualDeductions,
    annualNetIncome,
    effectiveRate,
    formattedMonthlyGrossIncome,
    formattedMonthlyTax: formatCurrency(monthlyTax),
    formattedMonthlyDeductions: formatCurrency(monthlyDeductions),
    formattedMonthlyNetIncome,
    formattedAnnualGrossIncome: formatCurrency(annualGrossIncome),
    formattedAnnualTax: formatCurrency(annualTax),
    formattedAnnualDeductions: formatCurrency(annualDeductions),
    formattedAnnualNetIncome: formatCurrency(annualNetIncome),
    formattedEffectiveRate: `${effectiveRate.toFixed(1)}%`,
    summary: `${formattedMonthlyNetIncome} monthly take-home from ${formattedMonthlyGrossIncome} gross`
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
