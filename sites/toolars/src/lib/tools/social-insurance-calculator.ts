export interface SocialInsuranceInput {
  salary: number;
  housingFundRate: number;
  baseMin?: number;
  baseMax?: number;
}

export interface SocialInsuranceBreakdownRow {
  item: string;
  employeeRate: string;
  employeeContribution: number;
  employerRate: string;
  employerContribution: number;
  formattedEmployeeContribution: string;
  formattedEmployerContribution: string;
}

export interface SocialInsuranceResult {
  contributionBase: number;
  employeeContribution: number;
  employerContribution: number;
  housingFundDeposit: number;
  tax: number;
  netSalary: number;
  formattedContributionBase: string;
  formattedEmployeeContribution: string;
  formattedEmployerContribution: string;
  formattedHousingFundDeposit: string;
  formattedTax: string;
  formattedNetSalary: string;
  contributionTone: "low" | "medium" | "high";
  summary: string;
  breakdown: SocialInsuranceBreakdownRow[];
}

export const defaultSocialInsuranceScenario: SocialInsuranceInput = {
  salary: 15000,
  housingFundRate: 0.12
};

function formatYuan(value: number) {
  const rounded = Math.round(value);

  if (Math.abs(rounded) >= 10000) {
    return `¥${(rounded / 10000).toFixed(2)}万`;
  }

  return `¥${rounded.toLocaleString("en-US")}`;
}

function calculateChinaMonthlyTax(taxableIncome: number) {
  const brackets = [
    [3000, 0.03],
    [12000, 0.1],
    [25000, 0.2],
    [35000, 0.25],
    [55000, 0.3],
    [80000, 0.35],
    [Infinity, 0.45]
  ] as const;
  let tax = 0;
  let remaining = Math.max(0, taxableIncome);
  let previousLimit = 0;

  for (const [limit, rate] of brackets) {
    const taxableAtBracket = Math.min(remaining, limit - previousLimit);
    tax += taxableAtBracket * rate;
    remaining -= taxableAtBracket;
    previousLimit = limit;

    if (remaining <= 0) break;
  }

  return tax;
}

function clampContributionBase(salary: number, baseMin?: number, baseMax?: number) {
  const min = baseMin && baseMin > 0 ? baseMin : salary * 0.6;
  const max = baseMax && baseMax > 0 ? baseMax : salary * 3;
  return Math.max(min, Math.min(salary, max));
}

export function calculateSocialInsurance(input: SocialInsuranceInput): SocialInsuranceResult {
  const salary = Math.max(0, input.salary);
  const housingFundRate = Math.min(0.12, Math.max(0.05, input.housingFundRate));
  const contributionBase = clampContributionBase(salary, input.baseMin, input.baseMax);
  const pensionEmployee = contributionBase * 0.08;
  const pensionEmployer = contributionBase * 0.16;
  const medicalEmployee = contributionBase * 0.02;
  const medicalEmployer = contributionBase * 0.08;
  const unemploymentEmployee = contributionBase * 0.005;
  const unemploymentEmployer = contributionBase * 0.005;
  const injuryEmployer = contributionBase * 0.005;
  const maternityEmployer = contributionBase * 0.008;
  const housingEmployee = contributionBase * housingFundRate;
  const housingEmployer = contributionBase * housingFundRate;
  const employeeContribution = pensionEmployee + medicalEmployee + unemploymentEmployee + housingEmployee;
  const employerContribution = pensionEmployer + medicalEmployer + unemploymentEmployer + injuryEmployer + maternityEmployer + housingEmployer;
  const housingFundDeposit = housingEmployee + housingEmployer;
  const taxableIncome = salary - employeeContribution - 5000;
  const tax = taxableIncome > 0 ? calculateChinaMonthlyTax(taxableIncome) : 0;
  const netSalary = salary - employeeContribution - tax;
  const contributionRatio = salary > 0 ? (employeeContribution / salary) * 100 : 0;
  const contributionTone = contributionRatio >= 25 ? "high" : contributionRatio >= 18 ? "medium" : "low";
  const rows = [
    ["Pension Insurance", "8%", pensionEmployee, "16%", pensionEmployer],
    ["Medical Insurance", "2%", medicalEmployee, "8%", medicalEmployer],
    ["Unemployment Insurance", "0.5%", unemploymentEmployee, "0.5%", unemploymentEmployer],
    ["Work Injury Insurance", "-", 0, "0.5%", injuryEmployer],
    ["Maternity Insurance", "-", 0, "0.8%", maternityEmployer],
    ["Housing Fund", `${(housingFundRate * 100).toFixed(0)}%`, housingEmployee, `${(housingFundRate * 100).toFixed(0)}%`, housingEmployer]
  ] as const;

  return {
    contributionBase,
    employeeContribution,
    employerContribution,
    housingFundDeposit,
    tax,
    netSalary,
    formattedContributionBase: formatYuan(contributionBase),
    formattedEmployeeContribution: formatYuan(employeeContribution),
    formattedEmployerContribution: formatYuan(employerContribution),
    formattedHousingFundDeposit: formatYuan(housingFundDeposit),
    formattedTax: formatYuan(tax),
    formattedNetSalary: formatYuan(netSalary),
    contributionTone,
    summary: `${formatYuan(netSalary)} estimated monthly net salary after contributions and tax`,
    breakdown: rows.map(([item, employeeRate, employeeContributionValue, employerRate, employerContributionValue]) => ({
      item,
      employeeRate,
      employeeContribution: employeeContributionValue,
      employerRate,
      employerContribution: employerContributionValue,
      formattedEmployeeContribution: formatYuan(employeeContributionValue),
      formattedEmployerContribution: formatYuan(employerContributionValue)
    }))
  };
}
