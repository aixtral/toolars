export interface OvulationInput {
  lastPeriodDate: string;
  cycleLengthDays: number;
  periodDurationDays: number;
}

export interface OvulationResult {
  ovulationDate: string;
  fertileStartDate: string;
  fertileEndDate: string;
  nextPeriodDate: string;
  safeStartDate: string;
  safeEndDate: string;
  menstruationEndDate: string;
  formattedOvulationDate: string;
  formattedFertileWindow: string;
  formattedNextPeriod: string;
  formattedSafePeriod: string;
  formattedMenstruation: string;
  summary: string;
  recommendation: string;
}

export const defaultOvulationScenario: OvulationInput = {
  lastPeriodDate: "2026-06-01",
  cycleLengthDays: 28,
  periodDurationDays: 5
};

export function calculateOvulation(input: OvulationInput): OvulationResult {
  const lmp = parseDate(input.lastPeriodDate);
  const cycleLengthDays = cleanInteger(input.cycleLengthDays, 28);
  const periodDurationDays = cleanInteger(input.periodDurationDays, 5);
  const ovulation = addDays(lmp, cycleLengthDays - 14);
  const fertileStart = addDays(ovulation, -5);
  const fertileEnd = addDays(ovulation, 1);
  const nextPeriod = addDays(lmp, cycleLengthDays);
  const safeStart = addDays(fertileEnd, 1);
  const safeEnd = addDays(nextPeriod, -1);
  const menstruationEnd = addDays(lmp, periodDurationDays - 1);

  return {
    ovulationDate: toIsoDate(ovulation),
    fertileStartDate: toIsoDate(fertileStart),
    fertileEndDate: toIsoDate(fertileEnd),
    nextPeriodDate: toIsoDate(nextPeriod),
    safeStartDate: toIsoDate(safeStart),
    safeEndDate: toIsoDate(safeEnd),
    menstruationEndDate: toIsoDate(menstruationEnd),
    formattedOvulationDate: formatShortDate(ovulation),
    formattedFertileWindow: `${formatShortDate(fertileStart)} - ${formatShortDate(fertileEnd)}`,
    formattedNextPeriod: formatShortDate(nextPeriod),
    formattedSafePeriod: `${formatShortDate(safeStart)} - ${formatShortDate(safeEnd)}`,
    formattedMenstruation: `${formatShortDate(lmp)} - ${formatShortDate(menstruationEnd)}`,
    summary: `${cycleLengthDays}-day cycle, ${periodDurationDays}-day period`,
    recommendation: "Use ovulation tests, basal temperature, and clinician guidance when precision matters."
  };
}

function cleanInteger(value: number, fallback: number): number {
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.round(value);
}

function parseDate(value: string): Date {
  const [year = 1970, month = 1, day = 1] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  }).format(date);
}
