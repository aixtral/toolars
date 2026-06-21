export interface OneRepMaxInput {
  weightKg: number;
  reps: number;
}

export interface OneRepMaxPercentageRow {
  percentage: number;
  reps: number;
  weightKg: number;
  formattedWeight: string;
  label: string;
}

export interface OneRepMaxResult {
  oneRepMaxKg: number;
  formattedOneRepMax: string;
  percentageRows: OneRepMaxPercentageRow[];
  summary: string;
  accuracyLabel: string;
  recommendation: string;
}

export const defaultOneRepMaxScenario: OneRepMaxInput = {
  weightKg: 80,
  reps: 5
};

const percentageTable = [
  { percentage: 95, reps: 2 },
  { percentage: 90, reps: 4 },
  { percentage: 85, reps: 6 },
  { percentage: 80, reps: 8 },
  { percentage: 75, reps: 10 },
  { percentage: 70, reps: 12 },
  { percentage: 65, reps: 15 },
  { percentage: 60, reps: 18 }
] as const;

export function calculateOneRepMax(input: OneRepMaxInput): OneRepMaxResult {
  const weightKg = cleanPositive(input.weightKg);
  const reps = cleanReps(input.reps);
  const oneRepMaxKg = weightKg * (1 + reps / 30);
  const percentageRows = percentageTable.map((row) => {
    const rowWeight = oneRepMaxKg * (row.percentage / 100);
    return {
      percentage: row.percentage,
      reps: row.reps,
      weightKg: rowWeight,
      formattedWeight: formatKg(rowWeight),
      label: `${row.percentage}% x ${row.reps} reps`
    };
  });
  const accuracyLabel = reps <= 10 ? "Epley reference" : "Lower accuracy";

  return {
    oneRepMaxKg,
    formattedOneRepMax: formatKg(oneRepMaxKg),
    percentageRows,
    summary: `${formatCompact(weightKg)} kg x ${formatCompact(reps)} reps`,
    accuracyLabel,
    recommendation:
      reps <= 10
        ? "Use percentage sets for training targets and avoid true max attempts without proper spotting."
        : "High-rep estimates are less accurate; retest with 1-10 reps when safe."
  };
}

function cleanPositive(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function cleanReps(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1;
  return Math.round(value);
}

function formatKg(value: number): string {
  return `${value.toFixed(1)} kg`;
}

function formatCompact(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}
