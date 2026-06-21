export interface SmokeFreeInput {
  quitDate: string;
  cigarettesPerDay: number;
  pricePerPack: number;
  cigarettesPerPack: number;
}

export interface SmokeFreeMilestone {
  days: number;
  time: string;
  message: string;
  reached: boolean;
}

export interface SmokeFreeResult {
  daysSmokeFree: number;
  cigarettesAvoided: number;
  moneySaved: number;
  lifeExtendedDays: number;
  milestones: SmokeFreeMilestone[];
  reachedMilestones: SmokeFreeMilestone[];
  nextMilestone: SmokeFreeMilestone | null;
  formattedMoneySaved: string;
  formattedCigarettesAvoided: string;
  formattedLifeExtended: string;
  summary: string;
}

export const defaultSmokeFreeScenario: SmokeFreeInput = {
  quitDate: "2026-01-01",
  cigarettesPerDay: 20,
  pricePerPack: 10,
  cigarettesPerPack: 20
};

const sourceMilestones = [
  { days: 0, time: "20 minutes", message: "Heart rate and blood pressure begin to drop" },
  { days: 1, time: "12 hours", message: "Carbon monoxide levels in blood return to normal" },
  { days: 3, time: "3 days", message: "Nicotine fully leaves the body; taste and smell improve" },
  { days: 14, time: "2 weeks", message: "Lung function and circulation start to improve" },
  { days: 90, time: "1-3 months", message: "Coughing and shortness of breath decrease" },
  { days: 365, time: "1 year", message: "Risk of coronary heart disease is cut in half" },
  { days: 1825, time: "5 years", message: "Stroke risk drops to near non-smoker levels" },
  { days: 3650, time: "10 years", message: "Lung cancer death risk is cut in half" },
  { days: 5475, time: "15 years", message: "Coronary heart disease risk same as non-smoker" }
];

export function calculateSmokeFree(input: SmokeFreeInput, asOf: Date = new Date()): SmokeFreeResult {
  const daysSmokeFree = Math.max(0, daysBetween(input.quitDate, asOf));
  const cigarettesPerDay = cleanNumber(input.cigarettesPerDay);
  const pricePerPack = cleanNumber(input.pricePerPack);
  const cigarettesPerPack = cleanNumber(input.cigarettesPerPack) || 20;
  const cigarettesAvoided = daysSmokeFree * cigarettesPerDay;
  const moneySaved = (daysSmokeFree * cigarettesPerDay * pricePerPack) / cigarettesPerPack;
  const lifeExtendedDays = (cigarettesAvoided * 11) / 60 / 24;
  const milestones = sourceMilestones.map((milestone) => ({
    ...milestone,
    reached: daysSmokeFree >= milestone.days
  }));
  const reachedMilestones = milestones.filter((milestone) => milestone.reached);
  const nextMilestone = milestones.find((milestone) => !milestone.reached) ?? null;

  return {
    daysSmokeFree,
    cigarettesAvoided,
    moneySaved,
    lifeExtendedDays,
    milestones,
    reachedMilestones,
    nextMilestone,
    formattedMoneySaved: formatCurrency(moneySaved),
    formattedCigarettesAvoided: `${Math.round(cigarettesAvoided).toLocaleString("en-US")} cigarettes`,
    formattedLifeExtended: `${lifeExtendedDays.toFixed(1)} days`,
    summary: daysSmokeFree > 0 ? `${daysSmokeFree.toLocaleString("en-US")} smoke-free days` : "Starting today"
  };
}

function daysBetween(quitDate: string, asOf: Date) {
  const quit = parseDateOnly(quitDate);
  const today = Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate());
  return Math.floor((today - quit) / 86400000);
}

function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return Date.UTC(1970, 0, 1);
  return Date.UTC(year, month - 1, day);
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
