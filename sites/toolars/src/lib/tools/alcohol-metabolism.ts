export type AlcoholSex = "male" | "female";
export type AlcoholDrinkType = "beer" | "wine" | "spirits" | "cocktail";
export type AlcoholStomachState = "ate" | "empty";

export interface AlcoholMetabolismInput {
  sex: AlcoholSex;
  weightKg: number;
  drinkType: AlcoholDrinkType;
  quantity: number;
  durationHours: number;
  stomach: AlcoholStomachState;
}

export interface AlcoholTimelinePoint {
  hour: number;
  bac: number;
  safeToDrive: boolean;
}

export interface AlcoholMetabolismResult {
  pureAlcohol: number;
  bac: number;
  status: string;
  timeTo002Hours: number;
  timeToZeroHours: number;
  timeline: AlcoholTimelinePoint[];
  formattedPureAlcohol: string;
  formattedBac: string;
  formattedTimeTo002: string;
  formattedTimeToZero: string;
  summary: string;
}

export const alcoholDrinkData: Record<AlcoholDrinkType, { abv: number; volumeMl: number; label: string }> = {
  beer: { abv: 5, volumeMl: 330, label: "Beer (5%, 330ml/can)" },
  wine: { abv: 13, volumeMl: 150, label: "Wine (13%, 150ml/glass)" },
  spirits: { abv: 40, volumeMl: 45, label: "Spirits (40%, 45ml/shot)" },
  cocktail: { abv: 15, volumeMl: 200, label: "Cocktail (15%, 200ml/glass)" }
};

export const defaultAlcoholMetabolismScenario: AlcoholMetabolismInput = {
  sex: "male",
  weightKg: 70,
  drinkType: "beer",
  quantity: 3,
  durationHours: 2,
  stomach: "ate"
};

export function calculateAlcoholMetabolism(input: AlcoholMetabolismInput): AlcoholMetabolismResult {
  const drink = alcoholDrinkData[input.drinkType] ?? alcoholDrinkData.beer;
  const quantity = cleanNumber(input.quantity) || 1;
  const durationHours = cleanNumber(input.durationHours) || 1;
  const weightKg = cleanNumber(input.weightKg);
  const pureAlcohol = (drink.abv * drink.volumeMl * quantity) / 100;
  const distributionRatio = input.sex === "male" ? 0.68 : 0.55;
  const baseBac = weightKg > 0 ? (pureAlcohol / (weightKg * distributionRatio)) * 100 : 0;
  const stomachAdjustedBac = input.stomach === "empty" ? baseBac * 1.2 : baseBac;
  const bac = Math.max(0, stomachAdjustedBac - 0.015 * durationHours);
  const timeTo002Hours = bac > 0.02 ? Math.ceil((bac - 0.02) / 0.015) : 0;
  const timeToZeroHours = bac > 0 ? Math.ceil(bac / 0.015) : 0;
  const status = getStatus(bac);
  const formattedBac = `${bac.toFixed(3)}%`;

  return {
    pureAlcohol,
    bac,
    status,
    timeTo002Hours,
    timeToZeroHours,
    timeline: buildTimeline(bac, timeToZeroHours),
    formattedPureAlcohol: `${pureAlcohol.toFixed(1)} g`,
    formattedBac,
    formattedTimeTo002: formatHours(timeTo002Hours),
    formattedTimeToZero: formatHours(timeToZeroHours),
    summary: `${formattedBac} estimated BAC - ${status}`
  };
}

function getStatus(bac: number): string {
  if (bac === 0) return "Fully metabolized";
  if (bac <= 0.02) return "Below China DUI limit";
  if (bac <= 0.05) return "Above China DUI limit";
  if (bac <= 0.08) return "Above most countries DUI limit";
  return "Severely impaired - do not drive";
}

function buildTimeline(bac: number, timeToZeroHours: number): AlcoholTimelinePoint[] {
  const hours = Math.max(5, Math.min(timeToZeroHours, 5));
  const points: AlcoholTimelinePoint[] = [];

  for (let hour = 1; hour <= hours; hour += 1) {
    const pointBac = Math.max(0, bac - 0.015 * hour);
    points.push({ hour, bac: pointBac, safeToDrive: pointBac <= 0.02 });
  }

  if (timeToZeroHours > 5) {
    points.push({ hour: timeToZeroHours, bac: 0, safeToDrive: true });
  }

  return points;
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatHours(value: number): string {
  return `${value.toLocaleString("en-US")} hours`;
}
