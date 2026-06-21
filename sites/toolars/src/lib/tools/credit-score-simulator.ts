export type CreditScoreAction = "payoff" | "pay-half" | "new-loan" | "miss-payment" | "increase-limit" | "close-card";

export interface CreditScoreInput {
  currentScore: number;
  creditLimit: number;
  currentBalance: number;
  action: CreditScoreAction;
}

export interface CreditScoreResult {
  currentScore: number;
  newScore: number;
  scoreChange: number;
  currentUtilization: number;
  newUtilization: number;
  rating: "Poor" | "Fair" | "Good" | "Very Good" | "Excellent";
  scoreRangePosition: number;
  formattedScoreChange: string;
  formattedCurrentUtilization: string;
  formattedNewUtilization: string;
  actionLabel: string;
  summary: string;
}

export const defaultCreditScoreScenario: CreditScoreInput = {
  currentScore: 680,
  creditLimit: 10000,
  currentBalance: 5000,
  action: "payoff"
};

const actionLabels: Record<CreditScoreAction, string> = {
  payoff: "Pay off all credit cards",
  "pay-half": "Pay off half of balance",
  "new-loan": "Take out a new loan",
  "miss-payment": "Miss one payment",
  "increase-limit": "Request 50% limit increase",
  "close-card": "Close oldest credit card"
};

export function calculateCreditScoreSimulation(input: CreditScoreInput): CreditScoreResult {
  const currentScore = clamp(Math.round(cleanNumber(input.currentScore)), 300, 850);
  const creditLimit = Math.max(1, cleanNumber(input.creditLimit));
  const currentBalance = cleanNumber(input.currentBalance);
  const currentUtilization = currentBalance / creditLimit;
  let newScore = currentScore;
  let newUtilization = currentUtilization;

  if (input.action === "payoff") {
    newUtilization = 0;
    newScore += Math.min(60, Math.round((currentUtilization - newUtilization) * 100 * 0.8));
  } else if (input.action === "pay-half") {
    newUtilization = currentUtilization / 2;
    newScore += Math.min(35, Math.round((currentUtilization - newUtilization) * 100 * 0.6));
  } else if (input.action === "new-loan") {
    newScore -= 10;
  } else if (input.action === "miss-payment") {
    newScore -= 60;
  } else if (input.action === "increase-limit") {
    newUtilization = currentBalance / (creditLimit * 1.5);
    newScore += Math.min(25, Math.round((currentUtilization - newUtilization) * 100 * 0.5));
  } else if (input.action === "close-card") {
    newScore -= 15;
  }

  newScore = clamp(Math.round(newScore), 300, 850);
  const scoreChange = newScore - currentScore;
  const rating = getRating(newScore);

  return {
    currentScore,
    newScore,
    scoreChange,
    currentUtilization,
    newUtilization,
    rating,
    scoreRangePosition: ((newScore - 300) / 550) * 100,
    formattedScoreChange: `${scoreChange > 0 ? "+" : ""}${scoreChange}`,
    formattedCurrentUtilization: formatPercent(currentUtilization),
    formattedNewUtilization: formatPercent(newUtilization),
    actionLabel: actionLabels[input.action],
    summary: `${newScore} simulated score after ${actionLabels[input.action].toLowerCase()}`
  };
}

function getRating(score: number): CreditScoreResult["rating"] {
  if (score < 580) return "Poor";
  if (score < 670) return "Fair";
  if (score < 740) return "Good";
  if (score < 800) return "Very Good";
  return "Excellent";
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function cleanNumber(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
