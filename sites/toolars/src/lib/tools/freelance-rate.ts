export interface FreelanceRateInput {
  goalIncome: number;
  vacationDays: number;
  weeklyWorkHours: number;
  nonBillableRatio: number;
  taxRate: number;
  insuranceCost: number;
  operatingCost: number;
  locationFactor: number;
}

export interface FreelanceRateResult {
  workWeeks: number;
  totalWorkHours: number;
  nonBillableHours: number;
  billableHours: number;
  taxAmount: number;
  locationAdjustment: number;
  totalRevenue: number;
  hourlyRate: number;
  dailyRate: number;
  projectRate: number;
  premiumRate: number;
  formattedWorkWeeks: string;
  formattedTotalWorkHours: string;
  formattedNonBillableHours: string;
  formattedBillableHours: string;
  formattedTaxAmount: string;
  formattedLocationAdjustment: string;
  formattedTotalRevenue: string;
  formattedHourlyRate: string;
  formattedDailyRate: string;
  formattedProjectRate: string;
  formattedPremiumRate: string;
  rateTone: "low" | "medium" | "high";
  summary: string;
}

export const defaultFreelanceRateScenario: FreelanceRateInput = {
  goalIncome: 200000,
  vacationDays: 20,
  weeklyWorkHours: 40,
  nonBillableRatio: 0.3,
  taxRate: 20,
  insuranceCost: 24000,
  operatingCost: 12000,
  locationFactor: 1.2
};

function formatYuan(value: number) {
  return `¥${Math.round(value).toLocaleString("en-US")}`;
}

function formatHours(value: number) {
  return `${Math.round(value).toLocaleString("en-US")} hours`;
}

export function calculateFreelanceRate(input: FreelanceRateInput): FreelanceRateResult {
  const goalIncome = Math.max(0, input.goalIncome);
  const vacationDays = Math.max(0, input.vacationDays);
  const weeklyWorkHours = Math.max(0, input.weeklyWorkHours);
  const nonBillableRatio = Math.min(0.99, Math.max(0, input.nonBillableRatio));
  const taxRate = Math.max(0, input.taxRate);
  const insuranceCost = Math.max(0, input.insuranceCost);
  const operatingCost = Math.max(0, input.operatingCost);
  const locationFactor = Math.max(0, input.locationFactor);
  const workWeeks = Math.max(1, 52 - vacationDays / 7);
  const totalWorkHours = Math.round(workWeeks * weeklyWorkHours);
  const nonBillableHours = Math.round(totalWorkHours * nonBillableRatio);
  const billableHours = Math.max(1, totalWorkHours - nonBillableHours);
  const taxAmount = goalIncome * (taxRate / 100);
  const subtotal = goalIncome + taxAmount + insuranceCost + operatingCost;
  const locationAdjustment = subtotal * (locationFactor - 1);
  const totalRevenue = subtotal * locationFactor;
  const hourlyRate = Math.ceil(totalRevenue / billableHours);
  const dailyRate = Math.ceil(hourlyRate * 8);
  const projectRate = Math.ceil(hourlyRate * 40);
  const premiumRate = Math.ceil(hourlyRate * 1.3);
  const rateTone = nonBillableRatio >= 0.5 || hourlyRate >= 250 ? "high" : hourlyRate >= 150 ? "medium" : "low";
  const formattedHourlyRate = formatYuan(hourlyRate);

  return {
    workWeeks,
    totalWorkHours,
    nonBillableHours,
    billableHours,
    taxAmount,
    locationAdjustment,
    totalRevenue,
    hourlyRate,
    dailyRate,
    projectRate,
    premiumRate,
    formattedWorkWeeks: `${Math.round(workWeeks)} weeks`,
    formattedTotalWorkHours: formatHours(totalWorkHours),
    formattedNonBillableHours: `${formatHours(nonBillableHours)} (${Math.round(nonBillableRatio * 100)}%)`,
    formattedBillableHours: formatHours(billableHours),
    formattedTaxAmount: `${formatYuan(taxAmount)} (${taxRate.toFixed(1)}%)`,
    formattedLocationAdjustment: `${formatYuan(locationAdjustment)} (x${locationFactor.toFixed(1)})`,
    formattedTotalRevenue: formatYuan(totalRevenue),
    formattedHourlyRate,
    formattedDailyRate: formatYuan(dailyRate),
    formattedProjectRate: formatYuan(projectRate),
    formattedPremiumRate: formatYuan(premiumRate),
    rateTone,
    summary: `${formattedHourlyRate} per billable hour covers target income, tax, costs, and location factor`
  };
}
