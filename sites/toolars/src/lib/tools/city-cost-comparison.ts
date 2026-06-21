export interface CityCostInputs {
  rent: number;
  food: number;
  transport: number;
  other: number;
}

export interface CityCostComparisonInput {
  monthlyIncome: number;
  cityA: CityCostInputs;
  cityB: CityCostInputs;
}

export interface CityCostComparisonResult {
  monthlyTax: number;
  netMonthlyIncome: number;
  cityACost: number;
  cityBCost: number;
  cityASurplus: number;
  cityBSurplus: number;
  annualDifference: number;
  winner: "city-a" | "city-b" | "tie";
  winnerTitle: string;
  winnerText: string;
  formattedMonthlyTax: string;
  formattedNetMonthlyIncome: string;
  formattedCityACost: string;
  formattedCityBCost: string;
  formattedCityASurplus: string;
  formattedCityBSurplus: string;
  formattedAnnualDifference: string;
  summary: string;
}

export const defaultCityCostComparisonScenario: CityCostComparisonInput = {
  monthlyIncome: 8000,
  cityA: {
    rent: 2500,
    food: 800,
    transport: 300,
    other: 600
  },
  cityB: {
    rent: 1200,
    food: 600,
    transport: 200,
    other: 400
  }
};

const dollars = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "USD"
});

function formatMoney(value: number) {
  return dollars.format(Math.round(value));
}

function calculateMonthlyFederalTax(monthlyIncome: number) {
  const annualIncome = Math.max(0, monthlyIncome) * 12;
  let tax = 0;

  if (annualIncome <= 11600) tax = annualIncome * 0.1;
  else if (annualIncome <= 47150) tax = 1160 + (annualIncome - 11600) * 0.12;
  else if (annualIncome <= 100525) tax = 5326 + (annualIncome - 47150) * 0.22;
  else if (annualIncome <= 191950) tax = 18532 + (annualIncome - 100525) * 0.24;
  else if (annualIncome <= 243725) tax = 35220 + (annualIncome - 191950) * 0.32;
  else if (annualIncome <= 609350) tax = 52337 + (annualIncome - 243725) * 0.35;
  else tax = 183647 + (annualIncome - 609350) * 0.37;

  return tax / 12;
}

function totalCityCost(city: CityCostInputs) {
  return Math.max(0, city.rent) + Math.max(0, city.food) + Math.max(0, city.transport) + Math.max(0, city.other);
}

export function calculateCityCostComparison(input: CityCostComparisonInput): CityCostComparisonResult {
  const monthlyIncome = Math.max(0, input.monthlyIncome);
  const monthlyTax = calculateMonthlyFederalTax(monthlyIncome);
  const netMonthlyIncome = monthlyIncome - monthlyTax;
  const cityACost = totalCityCost(input.cityA);
  const cityBCost = totalCityCost(input.cityB);
  const cityASurplus = netMonthlyIncome - cityACost;
  const cityBSurplus = netMonthlyIncome - cityBCost;
  const annualDifference = Math.abs(cityASurplus - cityBSurplus) * 12;
  let winner: CityCostComparisonResult["winner"] = "tie";
  let winnerTitle = "Costs are about the same";
  let winnerText = "Monthly surplus is nearly identical. Decide based on career, lifestyle, or family context.";

  if (cityBSurplus > cityASurplus) {
    winner = "city-b";
    winnerTitle = "City B saves more";
    winnerText = `Moving to City B could free up about ${formatMoney(annualDifference)} per year before moving costs.`;
  } else if (cityASurplus > cityBSurplus) {
    winner = "city-a";
    winnerTitle = "City A saves more";
    winnerText = `Staying in City A could free up about ${formatMoney(annualDifference)} per year before moving costs.`;
  }

  return {
    monthlyTax,
    netMonthlyIncome,
    cityACost,
    cityBCost,
    cityASurplus,
    cityBSurplus,
    annualDifference,
    winner,
    winnerTitle,
    winnerText,
    formattedMonthlyTax: formatMoney(monthlyTax),
    formattedNetMonthlyIncome: formatMoney(netMonthlyIncome),
    formattedCityACost: formatMoney(cityACost),
    formattedCityBCost: formatMoney(cityBCost),
    formattedCityASurplus: formatMoney(cityASurplus),
    formattedCityBSurplus: formatMoney(cityBSurplus),
    formattedAnnualDifference: formatMoney(annualDifference),
    summary: `${winnerTitle}: ${formatMoney(annualDifference)} annual surplus difference`
  };
}
