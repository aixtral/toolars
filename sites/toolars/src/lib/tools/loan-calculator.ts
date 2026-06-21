export interface LoanInput {
  principal: number;
  annualInterestRate: number;
  termYears: number;
}

export interface LoanYearSummary {
  year: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
  formattedPrincipalPaid: string;
  formattedInterestPaid: string;
  formattedEndingBalance: string;
}

export interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  paymentCount: number;
  formattedMonthlyPayment: string;
  formattedTotalInterest: string;
  formattedTotalRepayment: string;
  firstYear: LoanYearSummary;
  amortization: LoanYearSummary[];
  summary: string;
  recommendation: string;
}

export const defaultLoanScenario: LoanInput = {
  principal: 25000,
  annualInterestRate: 7.5,
  termYears: 5
};

export function calculateLoanPayment(input: LoanInput): LoanResult {
  const principal = cleanNumber(input.principal);
  const annualInterestRate = cleanNumber(input.annualInterestRate);
  const termYears = cleanNumber(input.termYears);
  const paymentCount = Math.round(termYears * 12);
  const monthlyRate = annualInterestRate / 100 / 12;
  const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, paymentCount);
  const totalRepayment = monthlyPayment * paymentCount;
  const totalInterest = Math.max(totalRepayment - principal, 0);
  const amortization = buildAmortization(principal, monthlyRate, monthlyPayment, termYears);
  const firstYear = amortization[0] ?? emptyYear();

  return {
    monthlyPayment,
    totalInterest,
    totalRepayment,
    paymentCount,
    formattedMonthlyPayment: formatCurrency(monthlyPayment),
    formattedTotalInterest: formatCurrency(totalInterest),
    formattedTotalRepayment: formatCurrency(totalRepayment),
    firstYear,
    amortization,
    summary: `${paymentCount} payments of ${formatCurrency(monthlyPayment)} over ${termYears} years`,
    recommendation: getRecommendation(annualInterestRate, termYears)
  };
}

function calculateMonthlyPayment(principal: number, monthlyRate: number, paymentCount: number): number {
  if (principal <= 0 || paymentCount <= 0) return 0;
  if (monthlyRate === 0) return principal / paymentCount;

  const growthFactor = Math.pow(1 + monthlyRate, paymentCount);
  return (principal * monthlyRate * growthFactor) / (growthFactor - 1);
}

function buildAmortization(principal: number, monthlyRate: number, monthlyPayment: number, termYears: number): LoanYearSummary[] {
  const years = Math.min(Math.round(termYears), 30);
  const rows: LoanYearSummary[] = [];
  let balance = principal;

  for (let year = 1; year <= years && balance > 0; year += 1) {
    let principalPaid = 0;
    let interestPaid = 0;

    for (let month = 0; month < 12 && balance > 0; month += 1) {
      const interest = balance * monthlyRate;
      const principalForMonth = Math.min(monthlyPayment - interest, balance);
      interestPaid += interest;
      principalPaid += principalForMonth;
      balance = Math.max(balance - principalForMonth, 0);
    }

    rows.push(formatYear({ year, principalPaid, interestPaid, endingBalance: balance }));
  }

  return rows;
}

function emptyYear(): LoanYearSummary {
  return formatYear({ year: 1, principalPaid: 0, interestPaid: 0, endingBalance: 0 });
}

function formatYear(row: Pick<LoanYearSummary, "year" | "principalPaid" | "interestPaid" | "endingBalance">): LoanYearSummary {
  return {
    ...row,
    formattedPrincipalPaid: formatCurrency(row.principalPaid),
    formattedInterestPaid: formatCurrency(row.interestPaid),
    formattedEndingBalance: formatCurrency(row.endingBalance)
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function getRecommendation(annualInterestRate: number, termYears: number): string {
  if (annualInterestRate >= 10) return "Compare APR and refinance options";
  if (termYears > 7) return "Review long-term interest exposure";
  return "Review APR and fees";
}
