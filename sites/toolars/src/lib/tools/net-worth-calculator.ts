export interface NetWorthInput {
  homeValue: number;
  investments: number;
  cashSavings: number;
  vehicleValue: number;
  otherAssets: number;
  mortgageBalance: number;
  carLoanBalance: number;
  creditCardDebt: number;
  studentLoanBalance: number;
  otherDebts: number;
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  debtToAssetRatioPercent: number;
  healthTone: "positive" | "negative";
  message: string;
  formattedTotalAssets: string;
  formattedTotalLiabilities: string;
  formattedNetWorth: string;
  summary: string;
}

export const defaultNetWorthScenario: NetWorthInput = {
  homeValue: 400000,
  investments: 85000,
  cashSavings: 25000,
  vehicleValue: 20000,
  otherAssets: 5000,
  mortgageBalance: 280000,
  carLoanBalance: 12000,
  creditCardDebt: 3000,
  studentLoanBalance: 25000,
  otherDebts: 0
};

export function calculateNetWorth(input: NetWorthInput): NetWorthResult {
  const totalAssets =
    cleanNumber(input.homeValue) +
    cleanNumber(input.investments) +
    cleanNumber(input.cashSavings) +
    cleanNumber(input.vehicleValue) +
    cleanNumber(input.otherAssets);
  const totalLiabilities =
    cleanNumber(input.mortgageBalance) +
    cleanNumber(input.carLoanBalance) +
    cleanNumber(input.creditCardDebt) +
    cleanNumber(input.studentLoanBalance) +
    cleanNumber(input.otherDebts);
  const netWorth = totalAssets - totalLiabilities;
  const debtToAssetRatioPercent = totalAssets > 0 ? roundOne((totalLiabilities / totalAssets) * 100) : 0;
  const healthTone = netWorth >= 0 ? "positive" : "negative";

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    debtToAssetRatioPercent,
    healthTone,
    message:
      healthTone === "positive"
        ? "Assets exceed liabilities. Keep tracking quarterly to see whether net worth is compounding."
        : "Liabilities exceed assets. Prioritize high-interest debt and cash reserves before adding risk.",
    formattedTotalAssets: formatCurrency(totalAssets),
    formattedTotalLiabilities: formatCurrency(totalLiabilities),
    formattedNetWorth: formatCurrency(netWorth),
    summary: `${formatCurrency(totalAssets)} assets minus ${formatCurrency(totalLiabilities)} liabilities`
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function roundOne(value: number): number {
  return Math.round(value * 10) / 10;
}

function formatCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.round(Math.abs(value)).toLocaleString("en-US")}`;
}
