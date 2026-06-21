export interface HeartRateZoneInput {
  age: number;
  restingHeartRate: number;
}

export interface HeartRateZoneRow {
  label: string;
  description: string;
  intensityLabel: string;
  minBpm: number;
  maxBpm: number;
  formattedRange: string;
}

export interface HeartRateZoneResult {
  maxHeartRate: number;
  heartRateReserve: number;
  formattedMaxHeartRate: string;
  formattedHeartRateReserve: string;
  zones: HeartRateZoneRow[];
  summary: string;
  recommendation: string;
}

export const defaultHeartRateZoneScenario: HeartRateZoneInput = {
  age: 30,
  restingHeartRate: 60
};

const zoneDefinitions = [
  { label: "Warm-up / Recovery", description: "Warm-up, cooldown, active recovery", intensityLabel: "50-60%", min: 0.5, max: 0.6 },
  { label: "Fat Burn", description: "Aerobic base and easier endurance work", intensityLabel: "60-70%", min: 0.6, max: 0.7 },
  { label: "Cardio Endurance", description: "Sustained cardiovascular fitness", intensityLabel: "70-80%", min: 0.7, max: 0.8 },
  { label: "Anaerobic Threshold", description: "Threshold intervals and harder tempo work", intensityLabel: "80-90%", min: 0.8, max: 0.9 },
  { label: "Maximum Effort", description: "VO2 max intervals and short peak efforts", intensityLabel: "90-100%", min: 0.9, max: 1 }
] as const;

export function calculateHeartRateZones(input: HeartRateZoneInput): HeartRateZoneResult {
  const age = cleanPositive(input.age);
  const restingHeartRate = cleanPositive(input.restingHeartRate);
  const maxHeartRate = Math.round(220 - age);
  const heartRateReserve = Math.round(maxHeartRate - restingHeartRate);
  const zones = zoneDefinitions.map((zone) => {
    const minBpm = Math.round(restingHeartRate + heartRateReserve * zone.min);
    const maxBpm = Math.round(restingHeartRate + heartRateReserve * zone.max);
    return {
      label: zone.label,
      description: zone.description,
      intensityLabel: zone.intensityLabel,
      minBpm,
      maxBpm,
      formattedRange: `${minBpm} - ${maxBpm} bpm`
    };
  });

  return {
    maxHeartRate,
    heartRateReserve,
    formattedMaxHeartRate: `${maxHeartRate} bpm`,
    formattedHeartRateReserve: `${heartRateReserve} bpm`,
    zones,
    summary: `${formatCompact(age)} years, ${formatCompact(restingHeartRate)} bpm resting HR`,
    recommendation: "Use resting HR measured after waking for a better Karvonen estimate."
  };
}

function cleanPositive(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCompact(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}
