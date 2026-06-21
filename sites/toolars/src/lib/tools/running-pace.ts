export type RunningDistancePreset = "5k" | "10k" | "half-marathon" | "marathon" | "custom";

export interface RunningPaceInput {
  distancePreset: RunningDistancePreset;
  customDistanceKm: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface RunningPaceEquivalent {
  name: string;
  distanceKm: number;
  totalSeconds: number;
  formattedTime: string;
  formattedPace: string;
}

export interface RunningPaceResult {
  distanceKm: number;
  totalSeconds: number;
  paceSecondsPerKm: number;
  speedKmh: number;
  formattedPacePerKm: string;
  formattedPacePerMile: string;
  formattedSpeed: string;
  formattedLap400m: string;
  formattedTargetTime: string;
  equivalents: RunningPaceEquivalent[];
  summary: string;
  recommendation: string;
}

export const runningDistanceOptions = [
  { value: "5k", label: "5K", distanceKm: 5 },
  { value: "10k", label: "10K", distanceKm: 10 },
  { value: "half-marathon", label: "Half Marathon", distanceKm: 21.0975 },
  { value: "marathon", label: "Marathon", distanceKm: 42.195 },
  { value: "custom", label: "Custom", distanceKm: null }
] as const;

export const defaultRunningPaceScenario: RunningPaceInput = {
  distancePreset: "10k",
  customDistanceKm: 10,
  hours: 0,
  minutes: 50,
  seconds: 0
};

const equivalentDistances = [
  { name: "1K", distanceKm: 1 },
  { name: "3K", distanceKm: 3 },
  { name: "5K", distanceKm: 5 },
  { name: "10K", distanceKm: 10 },
  { name: "Half Marathon", distanceKm: 21.0975 },
  { name: "Marathon", distanceKm: 42.195 }
] as const;

export function calculateRunningPace(input: RunningPaceInput): RunningPaceResult {
  const distanceKm = resolveDistance(input);
  const totalSeconds = Math.max(1, cleanNumber(input.hours) * 3600 + cleanNumber(input.minutes) * 60 + cleanNumber(input.seconds));
  const paceSecondsPerKm = totalSeconds / distanceKm;
  const speedKmh = distanceKm / (totalSeconds / 3600);
  const equivalents = equivalentDistances
    .filter((distance) => Math.abs(distance.distanceKm - distanceKm) >= 0.1)
    .map((distance) => {
      const equivalentSeconds = totalSeconds * Math.pow(distance.distanceKm / distanceKm, 1.06);
      return {
        name: distance.name,
        distanceKm: distance.distanceKm,
        totalSeconds: equivalentSeconds,
        formattedTime: formatTime(equivalentSeconds),
        formattedPace: formatPace(equivalentSeconds / distance.distanceKm)
      };
    });

  return {
    distanceKm,
    totalSeconds,
    paceSecondsPerKm,
    speedKmh,
    formattedPacePerKm: formatPace(paceSecondsPerKm),
    formattedPacePerMile: `${formatPace(paceSecondsPerKm * 1.60934)} /mi`,
    formattedSpeed: `${speedKmh.toFixed(1)} km/h`,
    formattedLap400m: formatTime(paceSecondsPerKm * 0.4),
    formattedTargetTime: formatTime(totalSeconds),
    equivalents,
    summary: `${getDistanceLabel(input.distancePreset, distanceKm)} in ${formatTime(totalSeconds)}`,
    recommendation: "Equivalent performances are estimates; terrain, heat, pacing, and training specificity can shift race outcomes."
  };
}

function resolveDistance(input: RunningPaceInput): number {
  if (input.distancePreset === "custom") return Math.max(0.1, cleanNumber(input.customDistanceKm) || 10);
  return runningDistanceOptions.find((option) => option.value === input.distancePreset)?.distanceKm ?? 10;
}

function getDistanceLabel(preset: RunningDistancePreset, distanceKm: number): string {
  return runningDistanceOptions.find((option) => option.value === preset)?.label ?? `${distanceKm.toFixed(1)} km`;
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatTime(totalSeconds: number): string {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;
  if (hours > 0) return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatPace(secondsPerKm: number): string {
  const rounded = Math.max(0, Math.round(secondsPerKm));
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return `${minutes}'${seconds.toString().padStart(2, "0")}"`;
}
