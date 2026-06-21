export interface StudentLoanInput {
  loanAmount: number;
  annualInterestRate: number;
  repaymentTermYears: number;
  graceMonths: number;
}

export interface StudentLoanYear {
  year: number;
  startingBalance: number;
  annualPayment: number;
  annualInterest: number;
  annualPrincipal: number;
  endingBalance: number;
  formattedStartingBalance: string;
  formattedAnnualPayment: string;
  formattedAnnualInterest: string;
  formattedAnnualPrincipal: string;
  formattedEndingBalance: string;
}

export interface StudentLoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  paymentCount: number;
  graceLabel: string;
  firstYear: StudentLoanYear;
  schedule: StudentLoanYear[];
  formattedLoanAmount: string;
  formattedMonthlyPayment: string;
  formattedTotalInterest: string;
  formattedTotalRepayment: string;
  summary: string;
}

export const defaultStudentLoanScenario: StudentLoanInput = {
  loanAmount: 50000,
  annualInterestRate: 5.5,
  repaymentTermYears: 10,
  graceMonths: 6
};

export function calculateStudentLoan(input: StudentLoanInput): StudentLoanResult {
  const loanAmount = cleanNumber(input.loanAmount);
  const annualInterestRate = cleanNumber(input.annualInterestRate);
  const repaymentTermYears = Math.max(1, cleanNumber(input.repaymentTermYears));
  const graceMonths = Math.max(0, Math.round(cleanNumber(input.graceMonths)));
  const monthlyRate = annualInterestRate / 100 / 12;
  const paymentCount = repaymentTermYears * 12;
  const monthlyPayment = calculatePayment(loanAmount, monthlyRate, paymentCount);
  const totalRepayment = monthlyPayment * paymentCount;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);
  const schedule = buildSchedule(loanAmount, monthlyPayment, monthlyRate, repaymentTermYears);
  const graceLabel = graceMonths > 0 ? `Repayment starts after ${graceMonths} months grace period` : "Standard repayment";

  return {
    monthlyPayment,
    totalInterest,
    totalRepayment,
    paymentCount,
    graceLabel,
    firstYear: schedule[0] ?? emptyYear(),
    schedule,
    formattedLoanAmount: formatMoney(loanAmount),
    formattedMonthlyPayment: formatMoney(monthlyPayment),
    formattedTotalInterest: formatMoney(totalInterest),
    formattedTotalRepayment: formatMoney(totalRepayment),
    summary: `${formatMoney(monthlyPayment)} monthly payment over ${repaymentTermYears} years`
  };
}

function buildSchedule(loanAmount: number, monthlyPayment: number, monthlyRate: number, repaymentTermYears: number) {
  let balance = loanAmount;
  const schedule: StudentLoanYear[] = [];

  for (let year = 1; year <= repaymentTermYears; year += 1) {
    const startingBalance = balance;
    let annualInterest = 0;
    let annualPrincipal = 0;

    for (let month = 0; month < 12 && balance > 1; month += 1) {
      const interest = balance * monthlyRate;
      const principal = Math.min(monthlyPayment - interest, balance);
      balance -= principal;
      annualInterest += interest;
      annualPrincipal += principal;
    }

    const annualPayment = annualInterest + annualPrincipal;
    const endingBalance = Math.max(0, balance);
    schedule.push({
      year,
      startingBalance,
      annualPayment,
      annualInterest,
      annualPrincipal,
      endingBalance,
      formattedStartingBalance: formatMoney(startingBalance),
      formattedAnnualPayment: formatMoney(annualPayment),
      formattedAnnualInterest: formatMoney(annualInterest),
      formattedAnnualPrincipal: formatMoney(annualPrincipal),
      formattedEndingBalance: formatMoney(endingBalance)
    });
  }

  return schedule;
}

function calculatePayment(principal: number, monthlyRate: number, paymentCount: number) {
  if (principal <= 0 || paymentCount <= 0) return 0;
  if (monthlyRate === 0) return principal / paymentCount;
  const growthFactor = Math.pow(1 + monthlyRate, paymentCount);
  return (principal * monthlyRate * growthFactor) / (growthFactor - 1);
}

function emptyYear(): StudentLoanYear {
  return {
    year: 0,
    startingBalance: 0,
    annualPayment: 0,
    annualInterest: 0,
    annualPrincipal: 0,
    endingBalance: 0,
    formattedStartingBalance: "$0",
    formattedAnnualPayment: "$0",
    formattedAnnualInterest: "$0",
    formattedAnnualPrincipal: "$0",
    formattedEndingBalance: "$0"
  };
}

function cleanNumber(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function formatMoney(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
