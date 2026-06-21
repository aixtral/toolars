export interface PregnancyDueDateInput {
  lmpDate: string;
  cycleLengthDays: number;
  asOfDate?: string;
}

export interface PregnancyDueDateResult {
  dueDate: string;
  conceptionDate: string;
  daysPregnant: number;
  totalDays: number;
  daysRemaining: number;
  progressPercent: number;
  formattedDueDate: string;
  formattedConceptionDate: string;
  gestationalAgeLabel: string;
  trimester: string;
  daysRemainingLabel: string;
  summary: string;
}

export const defaultPregnancyDueDateScenario: PregnancyDueDateInput = {
  lmpDate: "2026-01-01",
  cycleLengthDays: 30
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function calculatePregnancyDueDate(input: PregnancyDueDateInput): PregnancyDueDateResult {
  const cycleLengthDays = cleanCycleLength(input.cycleLengthDays);
  const cycleAdjustment = cycleLengthDays - 28;
  const lmpDate = parseDate(input.lmpDate);
  const asOfDate = parseDate(input.asOfDate ?? todayIsoDate());
  const dueDate = addDays(lmpDate, 280 + cycleAdjustment);
  const conceptionDate = addDays(lmpDate, 14 + cycleAdjustment);
  const daysPregnant = Math.floor((asOfDate.getTime() - lmpDate.getTime()) / DAY_MS);
  const totalDays = 280 + cycleAdjustment;
  const daysRemaining = totalDays - daysPregnant;
  const pregnantNow = daysPregnant >= 0;
  const gestationalWeeks = Math.floor(Math.max(daysPregnant, 0) / 7);
  const gestationalDays = Math.max(daysPregnant, 0) % 7;
  const progressPercent = pregnantNow ? Math.max(0, Math.min(100, Math.round((daysPregnant / totalDays) * 100))) : 0;

  return {
    dueDate: toIsoDate(dueDate),
    conceptionDate: toIsoDate(conceptionDate),
    daysPregnant,
    totalDays,
    daysRemaining,
    progressPercent,
    formattedDueDate: formatDate(dueDate),
    formattedConceptionDate: formatDate(conceptionDate),
    gestationalAgeLabel: pregnantNow ? `Week ${gestationalWeeks}, Day ${gestationalDays}` : "Not pregnant",
    trimester: getTrimester(daysPregnant),
    daysRemainingLabel: daysRemaining > 0 ? `${daysRemaining} days` : "Due now",
    summary: pregnantNow ? `${daysPregnant} days / ${totalDays} days` : "Select an LMP date before today"
  };
}

function cleanCycleLength(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 28;
  return Math.round(value);
}

function parseDate(value: string): Date {
  const [year = 1970, month = 1, day = 1] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function todayIsoDate(): string {
  return toIsoDate(new Date());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric"
  }).format(date);
}

function getTrimester(daysPregnant: number): string {
  if (daysPregnant < 0) return "Not pregnant";
  const weeks = Math.floor(daysPregnant / 7);
  if (weeks < 14) return "1st Trimester";
  if (weeks < 28) return "2nd Trimester";
  if (weeks <= 42) return "3rd Trimester";
  return "Overdue";
}
