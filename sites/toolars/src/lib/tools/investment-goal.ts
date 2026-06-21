export interface InvestmentGoalInput {
  goalAmount: number;
  startingBalance: number;
  annualReturn: number;
  years: number;
}

export interface InvestmentGoalScheduleRow {
  year: number;
  formattedBalance: string;
  formattedContributions: string;
}

export interface InvestmentGoalResult {
  monthlyInvestment: number;
  goalAmount: number;
  startingBalance: number;
  totalInvested: number;
  startingBalanceGrowth: number;
  goalGap: number;
  formattedMonthlyInvestment: string;
  formattedGoalAmount: string;
  formattedStartingBalance: string;
  formattedTotalInvested: string;
  formattedStartingBalanceGrowth: string;
  formattedGoalGap: string;
  goalStatus: "covered" | "needs-contribution";
  summary: string;
  schedule: InvestmentGoalScheduleRow[];
}

export const defaultInvestmentGoalScenario: InvestmentGoalInput = {
  goalAmount: 500000,
  startingBalance: 10000,
  annualReturn: 8,
  years: 20
};

const dollars = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "USD"
});

function formatMoney(value: number) {
  return dollars.format(Math.round(value));
}

export function calculateInvestmentGoal(input: InvestmentGoalInput): InvestmentGoalResult {
  const goalAmount = Math.max(0, input.goalAmount);
  const startingBalance = Math.max(0, input.startingBalance);
  const months = Math.max(1, input.years * 12);
  const monthlyRate = input.annualReturn / 100 / 12;
  const years = Math.max(1, input.years);
  const growth = monthlyRate === 0 ? 1 : Math.pow(1 + monthlyRate, months);
  const startingBalanceGrowth = startingBalance * growth;
  const goalGap = Math.max(0, goalAmount - startingBalanceGrowth);
  const monthlyInvestment =
    goalGap <= 0 ? 0 : monthlyRate === 0 ? goalGap / months : (goalGap * monthlyRate) / (growth - 1);
  const totalInvested = startingBalance + monthlyInvestment * months;
  const goalStatus = monthlyInvestment === 0 ? "covered" : "needs-contribution";
  const schedule: InvestmentGoalScheduleRow[] = [];
  let balance = startingBalance;

  for (let year = 1; year <= Math.min(years, 30); year += 1) {
    for (let month = 0; month < 12; month += 1) {
      balance = balance * (1 + monthlyRate) + monthlyInvestment;
    }
    schedule.push({
      year,
      formattedBalance: formatMoney(balance),
      formattedContributions: formatMoney(startingBalance + monthlyInvestment * year * 12)
    });
  }

  const formattedMonthlyInvestment = formatMoney(monthlyInvestment);
  const formattedGoalAmount = formatMoney(goalAmount);

  return {
    monthlyInvestment,
    goalAmount,
    startingBalance,
    totalInvested,
    startingBalanceGrowth,
    goalGap,
    formattedMonthlyInvestment,
    formattedGoalAmount,
    formattedStartingBalance: formatMoney(startingBalance),
    formattedTotalInvested: formatMoney(totalInvested),
    formattedStartingBalanceGrowth: formatMoney(startingBalanceGrowth),
    formattedGoalGap: formatMoney(goalGap),
    goalStatus,
    summary:
      goalStatus === "covered"
        ? `Starting balance can reach ${formattedGoalAmount} in ${years} years`
        : `${formattedMonthlyInvestment} per month to reach ${formattedGoalAmount} in ${years} years`,
    schedule
  };
}
