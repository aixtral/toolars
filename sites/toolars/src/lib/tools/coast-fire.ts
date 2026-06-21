export interface CoastFireInput {
  currentAge: number;
  retirementAge: number;
  currentAssets: number;
  annualExpenses: number;
  annualReturn: number;
  withdrawalRate: number;
}

export interface CoastFireResult {
  yearsToRetire: number;
  fireTarget: number;
  coastTarget: number;
  progress: number;
  gapOrSurplus: number;
  statusTone: "ready" | "gap";
  statusTitle: string;
  statusText: string;
  formattedFireTarget: string;
  formattedCoastTarget: string;
  formattedProgress: string;
  formattedGapOrSurplus: string;
  summary: string;
}

export const defaultCoastFireScenario: CoastFireInput = {
  currentAge: 30,
  retirementAge: 55,
  currentAssets: 500000,
  annualExpenses: 60000,
  annualReturn: 7,
  withdrawalRate: 4
};

const dollars = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "USD"
});

function formatMoney(value: number) {
  return dollars.format(Math.round(value));
}

export function calculateCoastFire(input: CoastFireInput): CoastFireResult {
  const currentAge = Math.max(0, input.currentAge);
  const retirementAge = Math.max(currentAge, input.retirementAge);
  const yearsToRetire = retirementAge - currentAge;
  const currentAssets = Math.max(0, input.currentAssets);
  const annualExpenses = Math.max(0, input.annualExpenses);
  const annualReturn = input.annualReturn / 100;
  const withdrawalRate = Math.max(0.0001, input.withdrawalRate / 100);
  const fireTarget = annualExpenses / withdrawalRate;
  const coastTarget = fireTarget / Math.pow(1 + annualReturn, yearsToRetire);
  const progress = coastTarget > 0 ? (currentAssets / coastTarget) * 100 : 0;
  const statusTone = currentAssets >= coastTarget ? "ready" : "gap";
  const gapOrSurplus = Math.abs(currentAssets - coastTarget);
  const statusTitle = statusTone === "ready" ? "Coast FIRE reached" : "Still building Coast FIRE";
  const statusText =
    statusTone === "ready"
      ? `Current assets exceed the Coast FIRE target by ${formatMoney(gapOrSurplus)}.`
      : `Current assets are ${progress.toFixed(1)}% of the Coast FIRE target; ${formatMoney(gapOrSurplus)} remains.`;

  return {
    yearsToRetire,
    fireTarget,
    coastTarget,
    progress,
    gapOrSurplus,
    statusTone,
    statusTitle,
    statusText,
    formattedFireTarget: formatMoney(fireTarget),
    formattedCoastTarget: formatMoney(coastTarget),
    formattedProgress: `${progress.toFixed(1)}%`,
    formattedGapOrSurplus: formatMoney(gapOrSurplus),
    summary: `${formatMoney(coastTarget)} Coast FIRE target over ${yearsToRetire} years`
  };
}
