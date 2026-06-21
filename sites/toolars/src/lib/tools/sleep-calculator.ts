export type SleepMode = "wakeup" | "bedtime";

export interface SleepInput {
  mode: SleepMode;
  mainTime: string;
  fallAsleepMinutes: number;
  cycleLengthMinutes: number;
  caffeineCutoffHours: number;
  screenCutoffHours: number;
}

export interface SleepOption {
  time: string;
  cycles: number;
  hours: string;
}

export interface SleepResult {
  modeLabel: string;
  primaryTime: string;
  resultLabel: string;
  resultSub: string;
  options: SleepOption[];
  caffeineCutoff: string;
  screenCutoff: string;
  dinnerCutoff: string;
  morningLight: string;
  timelineLabels: string[];
  recommendation: string;
}

export const defaultSleepScenario: SleepInput = {
  mode: "wakeup",
  mainTime: "07:00",
  fallAsleepMinutes: 15,
  cycleLengthMinutes: 90,
  caffeineCutoffHours: 10,
  screenCutoffHours: 1
};

const cycleOptions = [6, 5, 4, 3] as const;

export function calculateSleepSchedule(input: SleepInput): SleepResult {
  const mainTime = normalizeTime(input.mainTime);
  const fallAsleepMinutes = cleanPositive(input.fallAsleepMinutes);
  const cycleLengthMinutes = cleanPositive(input.cycleLengthMinutes) || 90;
  const caffeineCutoffHours = cleanPositive(input.caffeineCutoffHours);
  const screenCutoffHours = cleanPositive(input.screenCutoffHours);
  const mode = input.mode;

  const options = cycleOptions.map((cycles) => {
    const minutes = cycles * cycleLengthMinutes + fallAsleepMinutes;
    const time = mode === "wakeup" ? addMinutes(mainTime, -minutes) : addMinutes(mainTime, minutes);
    return {
      time,
      cycles,
      hours: ((cycles * cycleLengthMinutes) / 60).toFixed(1)
    };
  });

  const primaryTime = options[0].time;
  const bedtime = mode === "wakeup" ? primaryTime : mainTime;
  const wakeTime = mode === "wakeup" ? mainTime : primaryTime;

  return {
    modeLabel: mode === "wakeup" ? "Bedtime from wake-up" : "Wake-up from bedtime",
    primaryTime,
    resultLabel:
      mode === "wakeup"
        ? `Recommended bedtime (${options[0].cycles} cycles = ${options[0].hours} hours)`
        : `Recommended wake-up time (${options[0].cycles} cycles = ${options[0].hours} hours)`,
    resultSub: `About ${fallAsleepMinutes} minutes to enter the first sleep cycle`,
    options,
    caffeineCutoff: addMinutes(bedtime, -caffeineCutoffHours * 60),
    screenCutoff: addMinutes(bedtime, -screenCutoffHours * 60),
    dinnerCutoff: addMinutes(bedtime, -3 * 60),
    morningLight: addMinutes(wakeTime, 30),
    timelineLabels: ["Fall asleep", "Light", "Deep", "REM", "Wake"],
    recommendation: "Use these times as gentle anchors, not strict sleep-score targets."
  };
}

function normalizeTime(value: string): string {
  const [hourValue, minuteValue] = value.split(":").map(Number);
  const hours = Number.isFinite(hourValue) ? hourValue : 7;
  const minutes = Number.isFinite(minuteValue) ? minuteValue : 0;
  return formatMinutes(hours * 60 + minutes);
}

function addMinutes(value: string, minutes: number): string {
  const [hourValue, minuteValue] = normalizeTime(value).split(":").map(Number);
  return formatMinutes(hourValue * 60 + minuteValue + minutes);
}

function formatMinutes(totalMinutes: number): string {
  const normalized = mod(Math.round(totalMinutes), 24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function mod(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function cleanPositive(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
