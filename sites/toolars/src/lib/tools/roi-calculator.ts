export interface RoiInput {
  investmentCost: number;
  finalValue: number;
}

export interface RoiResult {
  investmentCost: number;
  finalValue: number;
  profit: number;
  roi: number;
  formattedCost: string;
  formattedFinalValue: string;
  formattedProfit: string;
  formattedRoi: string;
  resultTone: "gain" | "loss" | "flat";
  summary: string;
}

export const defaultRoiScenario: RoiInput = {
  investmentCost: 10000,
  finalValue: 15000
};

const dollars = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "USD"
});

function formatMoney(value: number) {
  return dollars.format(Math.round(Math.abs(value)));
}

export function calculateRoi(input: RoiInput): RoiResult {
  const investmentCost = Math.max(0, input.investmentCost);
  const finalValue = Math.max(0, input.finalValue);
  const profit = finalValue - investmentCost;
  const roi = investmentCost > 0 ? (profit / investmentCost) * 100 : 0;
  const resultTone = profit > 0 ? "gain" : profit < 0 ? "loss" : "flat";
  const formattedRoi = `${roi.toFixed(2)}%`;
  const formattedProfit = `${profit > 0 ? "+" : profit < 0 ? "-" : ""}${formatMoney(profit)}`;

  return {
    investmentCost,
    finalValue,
    profit,
    roi,
    formattedCost: formatMoney(investmentCost),
    formattedFinalValue: formatMoney(finalValue),
    formattedProfit,
    formattedRoi,
    resultTone,
    summary: `${formattedRoi} ROI with ${formattedProfit} net ${resultTone === "loss" ? "loss" : "profit"}`
  };
}
