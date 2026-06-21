export type SavingsChallengeMode = "52week" | "envelope" | "nospend" | "reverse";
export type SavingsChallengeFrequency = "daily" | "weekly" | "biweekly" | "monthly";

export interface SavingsChallengeInput {
  mode: SavingsChallengeMode;
  currency: string;
  startingAmount: number;
  weeklyIncrease: number;
  envelopeCount: number;
  envelopeFrequency: Exclude<SavingsChallengeFrequency, "monthly">;
  monthlyIncome: number;
  essentialExpenses: number;
  savingsGoal: number;
  alreadySaved: number;
  targetMonths: number;
  reverseFrequency: Exclude<SavingsChallengeFrequency, "daily">;
}

export interface SavingsChallengeScheduleRow {
  label: string;
  amount: number;
  cumulative: number;
  formattedAmount: string;
  formattedCumulative: string;
}

export interface SavingsChallengeResult {
  mode: SavingsChallengeMode;
  total: number;
  average: number;
  percent: number;
  perPeriod: number;
  durationLabel: string;
  frequencyLabel: string;
  formattedTotal: string;
  formattedAverage: string;
  formattedPerPeriod: string;
  schedule: SavingsChallengeScheduleRow[];
  summary: string;
}

export const defaultSavingsChallengeScenario: SavingsChallengeInput = {
  mode: "52week",
  currency: "¥",
  startingAmount: 1,
  weeklyIncrease: 1,
  envelopeCount: 100,
  envelopeFrequency: "weekly",
  monthlyIncome: 8000,
  essentialExpenses: 4000,
  savingsGoal: 10000,
  alreadySaved: 0,
  targetMonths: 12,
  reverseFrequency: "weekly"
};

export function calculateSavingsChallenge(input: SavingsChallengeInput): SavingsChallengeResult {
  if (input.mode === "envelope") return calculateEnvelope(input);
  if (input.mode === "nospend") return calculateNoSpend(input);
  if (input.mode === "reverse") return calculateReverse(input);
  return calculate52Week(input);
}

function calculate52Week(input: SavingsChallengeInput): SavingsChallengeResult {
  const startingAmount = Math.max(0, input.startingAmount);
  const weeklyIncrease = Math.max(0, input.weeklyIncrease);
  let total = 0;
  const schedule: SavingsChallengeScheduleRow[] = [];

  for (let week = 1; week <= 52; week += 1) {
    const amount = startingAmount + (week - 1) * weeklyIncrease;
    total += amount;
    schedule.push({
      label: `Week ${week}`,
      amount,
      cumulative: total,
      formattedAmount: formatCurrency(amount, input.currency),
      formattedCumulative: formatCurrency(total, input.currency)
    });
  }

  const average = Math.round(total / 52);
  return {
    mode: "52week",
    total,
    average,
    percent: 0,
    perPeriod: average,
    durationLabel: "52 weeks",
    frequencyLabel: "Weekly",
    formattedTotal: formatCurrency(total, input.currency),
    formattedAverage: formatCurrency(average, input.currency),
    formattedPerPeriod: formatCurrency(average, input.currency),
    schedule,
    summary: `Save ${formatCurrency(total, input.currency)} over 52 weeks`
  };
}

function calculateEnvelope(input: SavingsChallengeInput): SavingsChallengeResult {
  const count = Math.max(1, Math.round(input.envelopeCount));
  const total = (count * (count + 1)) / 2;
  const durationLabel =
    input.envelopeFrequency === "daily"
      ? `${count} days (about ${Math.round(count / 30)} months)`
      : input.envelopeFrequency === "weekly"
        ? `${count} weeks (about ${Math.round(count / 4.3)} months)`
        : `${count * 2} weeks (about ${Math.round((count * 2) / 4.3)} months)`;
  const schedule = Array.from({ length: count }, (_, index) => {
    const amount = index + 1;
    const cumulative = ((index + 1) * (index + 2)) / 2;
    return {
      label: `Envelope ${amount}`,
      amount,
      cumulative,
      formattedAmount: formatCurrency(amount, input.currency),
      formattedCumulative: formatCurrency(cumulative, input.currency)
    };
  });

  return {
    mode: "envelope",
    total,
    average: Math.round(total / count),
    percent: 0,
    perPeriod: Math.round(total / count),
    durationLabel,
    frequencyLabel: formatFrequency(input.envelopeFrequency),
    formattedTotal: formatCurrency(total, input.currency),
    formattedAverage: formatCurrency(Math.round(total / count), input.currency),
    formattedPerPeriod: formatCurrency(Math.round(total / count), input.currency),
    schedule,
    summary: `${count} envelopes save ${formatCurrency(total, input.currency)}`
  };
}

function calculateNoSpend(input: SavingsChallengeInput): SavingsChallengeResult {
  const income = Math.max(0, input.monthlyIncome);
  const saved = Math.max(0, income - Math.max(0, input.essentialExpenses));
  const percent = income > 0 ? (saved / income) * 100 : 0;

  return {
    mode: "nospend",
    total: saved,
    average: saved,
    percent,
    perPeriod: saved,
    durationLabel: "1 month",
    frequencyLabel: "Monthly",
    formattedTotal: formatCurrency(saved, input.currency),
    formattedAverage: formatCurrency(saved, input.currency),
    formattedPerPeriod: formatCurrency(saved, input.currency),
    schedule: [],
    summary: `${formatCurrency(saved, input.currency)} possible no-spend month savings`
  };
}

function calculateReverse(input: SavingsChallengeInput): SavingsChallengeResult {
  const needed = Math.max(0, input.savingsGoal - input.alreadySaved);
  const months = Math.max(1, Math.round(input.targetMonths));
  const periods =
    input.reverseFrequency === "weekly" ? months * 4.345 : input.reverseFrequency === "biweekly" ? months * 2.172 : months;
  const perPeriod = Math.ceil(needed / periods);

  return {
    mode: "reverse",
    total: needed,
    average: Math.ceil(needed / months),
    percent: 0,
    perPeriod,
    durationLabel: `${months} months`,
    frequencyLabel: formatFrequency(input.reverseFrequency),
    formattedTotal: formatCurrency(needed, input.currency),
    formattedAverage: formatCurrency(Math.ceil(needed / months), input.currency),
    formattedPerPeriod: formatCurrency(perPeriod, input.currency),
    schedule: [],
    summary: `${formatCurrency(perPeriod, input.currency)} ${formatFrequency(input.reverseFrequency).toLowerCase()} to reach ${formatCurrency(input.savingsGoal, input.currency)}`
  };
}

function formatFrequency(frequency: SavingsChallengeFrequency) {
  if (frequency === "daily") return "Daily";
  if (frequency === "biweekly") return "Biweekly";
  if (frequency === "monthly") return "Monthly";
  return "Weekly";
}

function formatCurrency(value: number, currency: string) {
  return `${currency}${Math.round(value).toLocaleString("en-US")}`;
}
