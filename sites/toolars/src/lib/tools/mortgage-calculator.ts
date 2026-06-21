export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  annualInterestRate: number;
  loanTermYears: number;
  propertyTaxAnnual: number;
  insuranceMonthly: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyEscrow: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  downPaymentPercent: number;
  loanToValuePercent: number;
  formattedLoanAmount: string;
  formattedPrincipalAndInterest: string;
  formattedMonthlyEscrow: string;
  formattedMonthlyPayment: string;
  formattedTotalInterest: string;
  summary: string;
  recommendation: string;
}

export const defaultMortgageScenario: MortgageInput = {
  homePrice: 450000,
  downPayment: 90000,
  annualInterestRate: 6.5,
  loanTermYears: 30,
  propertyTaxAnnual: 5400,
  insuranceMonthly: 150
};

export function calculateMortgagePayment(input: MortgageInput): MortgageResult {
  const homePrice = cleanNumber(input.homePrice);
  const downPayment = Math.min(cleanNumber(input.downPayment), homePrice);
  const annualInterestRate = cleanNumber(input.annualInterestRate);
  const loanTermYears = cleanNumber(input.loanTermYears);
  const propertyTaxAnnual = cleanNumber(input.propertyTaxAnnual);
  const insuranceMonthly = cleanNumber(input.insuranceMonthly);
  const loanAmount = Math.max(homePrice - downPayment, 0);
  const monthCount = Math.round(loanTermYears * 12);
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const monthlyPrincipalAndInterest = calculatePrincipalAndInterest(loanAmount, monthlyInterestRate, monthCount);
  const monthlyPropertyTax = propertyTaxAnnual / 12;
  const monthlyEscrow = monthlyPropertyTax + insuranceMonthly;
  const monthlyPayment = monthlyPrincipalAndInterest + monthlyEscrow;
  const totalInterest = monthCount > 0 ? Math.max(monthlyPrincipalAndInterest * monthCount - loanAmount, 0) : 0;
  const totalPaid = downPayment + monthlyPayment * monthCount;
  const downPaymentPercent = homePrice > 0 ? Math.round((downPayment / homePrice) * 100) : 0;
  const loanToValuePercent = homePrice > 0 ? Math.round((loanAmount / homePrice) * 100) : 0;

  return {
    loanAmount,
    monthlyPrincipalAndInterest,
    monthlyPropertyTax,
    monthlyInsurance: insuranceMonthly,
    monthlyEscrow,
    monthlyPayment,
    totalInterest,
    totalPaid,
    downPaymentPercent,
    loanToValuePercent,
    formattedLoanAmount: formatCurrency(loanAmount),
    formattedPrincipalAndInterest: formatCurrency(monthlyPrincipalAndInterest),
    formattedMonthlyEscrow: formatCurrency(monthlyEscrow),
    formattedMonthlyPayment: formatCurrency(monthlyPayment),
    formattedTotalInterest: formatCurrency(totalInterest),
    summary: `Principal and interest ${formatCurrency(monthlyPrincipalAndInterest)} + escrow ${formatCurrency(monthlyEscrow)}`,
    recommendation: getRecommendation(downPaymentPercent, loanToValuePercent)
  };
}

function calculatePrincipalAndInterest(principal: number, monthlyInterestRate: number, monthCount: number): number {
  if (principal <= 0 || monthCount <= 0) return 0;
  if (monthlyInterestRate === 0) return principal / monthCount;

  const growthFactor = Math.pow(1 + monthlyInterestRate, monthCount);
  return (principal * monthlyInterestRate * growthFactor) / (growthFactor - 1);
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function getRecommendation(downPaymentPercent: number, loanToValuePercent: number): string {
  if (downPaymentPercent >= 20 && loanToValuePercent <= 80) return "Strong down payment cushion";
  if (downPaymentPercent >= 10) return "Review PMI and escrow";
  return "Increase down payment cushion";
}
