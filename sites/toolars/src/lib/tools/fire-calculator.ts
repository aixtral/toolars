export interface FireInput {
  annualExpenses: number;
  annualIncome: number;
  currentNetWorth: number;
  annualReturn: number;
}

export interface FireResult {
  fireNumber: number;
  annualSavings: number;
  savingsRate: number;
  yearsToFire: number;
  yearsToFireLabel: string;
  projectedBalance: number;
  formattedFireNumber: string;
  formattedAnnualSavings: string;
  formattedSavingsRate: string;
  formattedYearsToFire: string;
  formattedProjectedBalance: string;
  guidanceTone: "fast" | "steady" | "slow" | "blocked";
  guidance: string;
  summary: string;
}

export const defaultFireScenario: FireInput = {
  annualExpenses: 50000,
  annualIncome: 100000,
  currentNetWorth: 200000,
  annualReturn: 7
};

const dollars = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "USD"
});

function formatMoney(value: number) {
  return dollars.format(Math.round(value));
}

export function calculateFire(input: FireInput): FireResult {
  const annualExpenses = Math.max(0, input.annualExpenses);
  const annualIncome = Math.max(0, input.annualIncome);
  const annualReturn = input.annualReturn / 100;
  const fireNumber = annualExpenses * 25;
  const annualSavings = annualIncome - annualExpenses;
  const savingsRate = annualIncome > 0 ? (annualSavings / annualIncome) * 100 : 0;
  let yearsToFire = 0;
  let projectedBalance = Math.max(0, input.currentNetWorth);

  while (projectedBalance < fireNumber && yearsToFire < 100) {
    yearsToFire += 1;
    projectedBalance = projectedBalance * (1 + annualReturn) + annualSavings;
  }

  const yearsToFireLabel = yearsToFire >= 100 ? "100+" : String(yearsToFire);
  const guidanceTone = annualSavings <= 0 ? "blocked" : yearsToFire < 10 ? "fast" : yearsToFire < 25 ? "steady" : "slow";
  const guidance =
    guidanceTone === "blocked"
      ? "Savings rate is zero or negative. Increase income or reduce expenses before FIRE math becomes useful."
      : guidanceTone === "fast"
        ? "Excellent savings rate. Financial independence is within reach if assumptions hold."
        : guidanceTone === "steady"
          ? "FIRE is achievable with consistent saving and long-term return discipline."
          : "Savings rate is low. Consider higher income, lower spending, or a longer runway.";

  return {
    fireNumber,
    annualSavings,
    savingsRate,
    yearsToFire,
    yearsToFireLabel,
    projectedBalance,
    formattedFireNumber: formatMoney(fireNumber),
    formattedAnnualSavings: formatMoney(annualSavings),
    formattedSavingsRate: `${savingsRate.toFixed(1)}%`,
    formattedYearsToFire: yearsToFire >= 100 ? "100+" : `${yearsToFire} years`,
    formattedProjectedBalance: formatMoney(projectedBalance),
    guidanceTone,
    guidance,
    summary: `${formatMoney(fireNumber)} FIRE number with ${savingsRate.toFixed(1)}% savings rate`
  };
}
