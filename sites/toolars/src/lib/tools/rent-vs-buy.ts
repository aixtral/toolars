export interface RentVsBuyInput {
  homePrice: number;
  downPaymentPercent: number;
  mortgageRate: number;
  annualHoldingCost: number;
  monthlyRent: number;
  investmentReturn: number;
  years: number;
}

export interface RentVsBuyResult {
  downPayment: number;
  loanAmount: number;
  monthlyMortgage: number;
  buyingCost: number;
  rentingCost: number;
  opportunityCost: number;
  difference: number;
  recommendation: "buy" | "rent";
  recommendationTitle: string;
  formattedDownPayment: string;
  formattedMonthlyMortgage: string;
  formattedBuyingCost: string;
  formattedRentingCost: string;
  formattedOpportunityCost: string;
  formattedDifference: string;
  summary: string;
}

export const defaultRentVsBuyScenario: RentVsBuyInput = {
  homePrice: 300000,
  downPaymentPercent: 20,
  mortgageRate: 4.5,
  annualHoldingCost: 5000,
  monthlyRent: 1500,
  investmentReturn: 7,
  years: 10
};

const dollars = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "USD"
});

function formatMoney(value: number) {
  return dollars.format(Math.round(value));
}

function loanPayment(principal: number, monthlyRate: number, months: number) {
  if (principal <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return principal * ((monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
}

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const homePrice = Math.max(0, input.homePrice);
  const downPayment = homePrice * (Math.max(0, input.downPaymentPercent) / 100);
  const loanAmount = Math.max(0, homePrice - downPayment);
  const months = Math.max(1, input.years * 12);
  const monthlyMortgage = loanPayment(loanAmount, Math.max(0, input.mortgageRate) / 100 / 12, months);
  const buyingCost = downPayment + monthlyMortgage * months + Math.max(0, input.annualHoldingCost) * Math.max(0, input.years);
  const opportunityCost = downPayment * (Math.max(0, input.investmentReturn) / 100) * Math.max(0, input.years);
  const rentingCost = Math.max(0, input.monthlyRent) * months + opportunityCost;
  const recommendation = buyingCost < rentingCost ? "buy" : "rent";
  const difference = Math.abs(buyingCost - rentingCost);
  const recommendationTitle = recommendation === "buy" ? "Buying is better" : "Renting is better";

  return {
    downPayment,
    loanAmount,
    monthlyMortgage,
    buyingCost,
    rentingCost,
    opportunityCost,
    difference,
    recommendation,
    recommendationTitle,
    formattedDownPayment: formatMoney(downPayment),
    formattedMonthlyMortgage: `${formatMoney(monthlyMortgage)}/mo`,
    formattedBuyingCost: formatMoney(buyingCost),
    formattedRentingCost: formatMoney(rentingCost),
    formattedOpportunityCost: formatMoney(opportunityCost),
    formattedDifference: formatMoney(difference),
    summary: `${recommendationTitle} by ${formatMoney(difference)} over ${input.years} years`
  };
}
