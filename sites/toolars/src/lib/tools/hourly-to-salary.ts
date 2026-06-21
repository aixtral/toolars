export interface HourlyToSalaryInput {
  hourlyRate: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  overtimeHoursPerWeek: number;
  overtimeMultiplier: number;
}

export interface HourlyToSalaryResult {
  hourlyRate: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  overtimeHoursPerWeek: number;
  overtimeMultiplier: number;
  basePay: number;
  overtimePay: number;
  annualSalary: number;
  monthlySalary: number;
  weeklySalary: number;
  formattedBasePay: string;
  formattedOvertimePay: string;
  formattedAnnualSalary: string;
  formattedMonthlySalary: string;
  formattedWeeklySalary: string;
  summary: string;
}

export const defaultHourlyToSalaryScenario: HourlyToSalaryInput = {
  hourlyRate: 25,
  hoursPerWeek: 40,
  weeksPerYear: 52,
  overtimeHoursPerWeek: 0,
  overtimeMultiplier: 2
};

export function calculateHourlyToSalary(input: HourlyToSalaryInput): HourlyToSalaryResult {
  const hourlyRate = cleanAmount(input.hourlyRate);
  const hoursPerWeek = cleanAmount(input.hoursPerWeek) || 40;
  const weeksPerYear = cleanAmount(input.weeksPerYear) || 52;
  const overtimeHoursPerWeek = cleanAmount(input.overtimeHoursPerWeek);
  const overtimeMultiplier = cleanAmount(input.overtimeMultiplier) || 1;
  const basePay = hourlyRate * hoursPerWeek * weeksPerYear;
  const overtimePay = hourlyRate * overtimeMultiplier * overtimeHoursPerWeek * weeksPerYear;
  const annualSalary = basePay + overtimePay;
  const monthlySalary = annualSalary / 12;
  const weeklySalary = annualSalary / weeksPerYear;

  return {
    hourlyRate,
    hoursPerWeek,
    weeksPerYear,
    overtimeHoursPerWeek,
    overtimeMultiplier,
    basePay,
    overtimePay,
    annualSalary,
    monthlySalary,
    weeklySalary,
    formattedBasePay: formatCurrency(basePay),
    formattedOvertimePay: formatCurrency(overtimePay),
    formattedAnnualSalary: formatCurrency(annualSalary),
    formattedMonthlySalary: formatCurrency(monthlySalary),
    formattedWeeklySalary: formatCurrency(weeklySalary),
    summary: `$${hourlyRate.toFixed(2)} x ${formatNumber(hoursPerWeek)} hours/week x ${formatNumber(weeksPerYear)} weeks`
  };
}

function cleanAmount(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}
