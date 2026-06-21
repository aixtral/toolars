export interface EmergencyFundInput {
  monthlyExpenses: number;
  coverageMonths: number;
  currentSavings: number;
  targetTimelineMonths: number;
}

export interface EmergencyFundResult {
  target: number;
  gap: number;
  monthlySavingsNeeded: number;
  progressPercent: number;
  formattedTarget: string;
  formattedGap: string;
  formattedMonthlySavingsNeeded: string;
  formattedCurrentSavings: string;
  progressLabel: string;
  summary: string;
}

export const defaultEmergencyFundScenario: EmergencyFundInput = {
  monthlyExpenses: 3000,
  coverageMonths: 6,
  currentSavings: 5000,
  targetTimelineMonths: 12
};

export const emergencyCoverageOptions = [3, 6, 9, 12] as const;
export const emergencyTimelineOptions = [6, 12, 18, 24, 36] as const;

export function calculateEmergencyFund(input: EmergencyFundInput): EmergencyFundResult {
  const monthlyExpenses = cleanNumber(input.monthlyExpenses);
  const coverageMonths = cleanNumber(input.coverageMonths);
  const currentSavings = cleanNumber(input.currentSavings);
  const targetTimelineMonths = Math.max(1, cleanNumber(input.targetTimelineMonths));
  const target = monthlyExpenses * coverageMonths;
  const gap = Math.max(0, target - currentSavings);
  const monthlySavingsNeeded = gap > 0 ? gap / targetTimelineMonths : 0;
  const progressPercent = target > 0 ? Math.min(100, Math.round((currentSavings / target) * 1000) / 10) : 0;

  return {
    target,
    gap,
    monthlySavingsNeeded,
    progressPercent,
    formattedTarget: formatCurrency(target),
    formattedGap: formatCurrency(gap),
    formattedMonthlySavingsNeeded: formatCurrency(monthlySavingsNeeded),
    formattedCurrentSavings: formatCurrency(currentSavings),
    progressLabel: `${formatCurrency(currentSavings)} / ${formatCurrency(target)}`,
    summary: `${coverageMonths} months of expenses at ${formatCurrency(monthlyExpenses)}/month`
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
