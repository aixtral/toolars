export type IntermittentFastingProtocol = "16:8" | "18:6" | "20:4" | "14:10" | "OMAD" | "5:2";

export interface IntermittentFastingInput {
  protocol: IntermittentFastingProtocol;
  lastMealTime: string;
}

export interface IntermittentFastingTimelineRow {
  label: string;
  value: string;
  tone: "neutral" | "active";
}

export interface IntermittentFastingResult {
  protocolLabel: string;
  fastingHours: number;
  eatingHours: number;
  displayFastingHours: number;
  formattedFastingHours: string;
  nextMealTime: string;
  eatingWindow: string;
  fastingWindow: string;
  timeline: IntermittentFastingTimelineRow[];
  recommendation: string;
}

export const defaultIntermittentFastingScenario: IntermittentFastingInput = {
  protocol: "16:8",
  lastMealTime: "20:00"
};

export const intermittentFastingProtocolOptions = [
  { value: "16:8", label: "16:8 (Most popular)" },
  { value: "18:6", label: "18:6" },
  { value: "20:4", label: "20:4 (Warrior diet)" },
  { value: "14:10", label: "14:10 (Gentle)" },
  { value: "OMAD", label: "OMAD (One meal)" },
  { value: "5:2", label: "5:2 (2 low-cal days)" }
] as const;

export function calculateIntermittentFasting(input: IntermittentFastingInput): IntermittentFastingResult {
  const protocol = input.protocol;
  const { fastingHours, eatingHours } = getProtocolWindow(protocol);
  const lastMealTime = normalizeTime(input.lastMealTime);
  const nextMealTime = addHours(lastMealTime, fastingHours);
  const eatingEndTime = addHours(nextMealTime, eatingHours);
  const displayFastingHours = fastingHours || 24;
  const eatingWindow = `${nextMealTime} - ${eatingEndTime}`;
  const fastingWindow = `${eatingEndTime} - ${nextMealTime} (next day)`;
  const timeline =
    protocol === "5:2"
      ? [
          {
            label: "5:2 protocol",
            value: "Eat normally 5 days and use 2 non-consecutive lower-calorie days.",
            tone: "neutral" as const
          }
        ]
      : [
          { label: "Last meal ends", value: lastMealTime, tone: "neutral" as const },
          { label: "Fasting begins", value: lastMealTime, tone: "neutral" as const },
          { label: "You may eat", value: nextMealTime, tone: "active" as const },
          { label: "Eating window closes", value: eatingEndTime, tone: "neutral" as const }
        ];

  return {
    protocolLabel: protocol,
    fastingHours,
    eatingHours,
    displayFastingHours,
    formattedFastingHours: `${displayFastingHours} hours`,
    nextMealTime,
    eatingWindow,
    fastingWindow,
    timeline,
    recommendation:
      protocol === "5:2"
        ? "Plan the two lower-calorie days away from hard training or long shifts."
        : "Keep hydration and sleep steady; stop if fasting triggers dizziness or disordered eating patterns."
  };
}

function getProtocolWindow(protocol: IntermittentFastingProtocol): { fastingHours: number; eatingHours: number } {
  if (protocol === "OMAD") return { fastingHours: 23, eatingHours: 1 };
  if (protocol === "5:2") return { fastingHours: 0, eatingHours: 24 };
  const [fastingHours, eatingHours] = protocol.split(":").map(Number);
  return { fastingHours, eatingHours };
}

function normalizeTime(value: string): string {
  const [hourValue, minuteValue] = value.split(":").map(Number);
  const hours = Number.isFinite(hourValue) ? hourValue : 20;
  const minutes = Number.isFinite(minuteValue) ? minuteValue : 0;
  return `${mod(hours, 24).toString().padStart(2, "0")}:${mod(minutes, 60).toString().padStart(2, "0")}`;
}

function addHours(value: string, hours: number): string {
  const [hourValue, minuteValue] = value.split(":").map(Number);
  const totalMinutes = hourValue * 60 + minuteValue + hours * 60;
  const normalized = mod(totalMinutes, 24 * 60);
  const nextHours = Math.floor(normalized / 60);
  const nextMinutes = normalized % 60;
  return `${nextHours.toString().padStart(2, "0")}:${nextMinutes.toString().padStart(2, "0")}`;
}

function mod(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}
