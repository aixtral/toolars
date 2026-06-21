export type SideIncomeFilingStatus = "single" | "mfj" | "mfs" | "hoh";

export interface SideIncomeTaxInput {
  salary: number;
  sideIncome: number;
  businessExpenses: number;
  retirementContribution: number;
  filingStatus: SideIncomeFilingStatus;
  stateTaxRate: number;
}

export interface SideIncomeTaxResult {
  netSelfEmploymentIncome: number;
  selfEmploymentTax: number;
  federalTax: number;
  stateTax: number;
  federalAndStateTax: number;
  totalTax: number;
  taxableIncome: number;
  effectiveRate: number;
  quarterlyPayment: number;
  formattedNetSelfEmploymentIncome: string;
  formattedSelfEmploymentTax: string;
  formattedFederalAndStateTax: string;
  formattedTotalTax: string;
  formattedTaxableIncome: string;
  formattedEffectiveRate: string;
  formattedQuarterlyPayment: string;
  taxTone: "low" | "medium" | "high";
  summary: string;
}

export const defaultSideIncomeTaxScenario: SideIncomeTaxInput = {
  salary: 80000,
  sideIncome: 30000,
  businessExpenses: 5000,
  retirementContribution: 6000,
  filingStatus: "single",
  stateTaxRate: 5
};

const dollars = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "USD"
});

function formatMoney(value: number) {
  return dollars.format(Math.round(value));
}

function federalBrackets(status: SideIncomeFilingStatus) {
  if (status === "mfj") {
    return [
      [23200, 0.1, 0],
      [94300, 0.12, 2320],
      [201050, 0.22, 10652],
      [383900, 0.24, 37064],
      [487450, 0.32, 70440],
      [731200, 0.35, 104676],
      [Infinity, 0.37, 186618]
    ] as const;
  }

  if (status === "mfs") {
    return [
      [11600, 0.1, 0],
      [47150, 0.12, 1160],
      [100525, 0.22, 5326],
      [191950, 0.24, 18532],
      [243725, 0.32, 35220],
      [365600, 0.35, 52337],
      [Infinity, 0.37, 93309]
    ] as const;
  }

  if (status === "hoh") {
    return [
      [16550, 0.1, 0],
      [63100, 0.12, 1655],
      [100500, 0.22, 7329],
      [191950, 0.24, 15569],
      [243700, 0.32, 35161],
      [609350, 0.35, 52278],
      [Infinity, 0.37, 180502]
    ] as const;
  }

  return [
    [11600, 0.1, 0],
    [47150, 0.12, 1160],
    [100525, 0.22, 5326],
    [191950, 0.24, 18532],
    [243725, 0.32, 35220],
    [609350, 0.35, 52337],
    [Infinity, 0.37, 183647]
  ] as const;
}

function standardDeduction(status: SideIncomeFilingStatus) {
  if (status === "mfj") return 29200;
  if (status === "hoh") return 21900;
  return 14600;
}

function calculateFederalTax(taxableIncome: number, status: SideIncomeFilingStatus) {
  let previousLimit = 0;

  for (const [limit, rate, base] of federalBrackets(status)) {
    if (taxableIncome <= limit) {
      return base + Math.max(0, taxableIncome - previousLimit) * rate;
    }

    previousLimit = limit;
  }

  return 0;
}

export function calculateSideIncomeTax(input: SideIncomeTaxInput): SideIncomeTaxResult {
  const salary = Math.max(0, input.salary);
  const sideIncome = Math.max(0, input.sideIncome);
  const businessExpenses = Math.max(0, input.businessExpenses);
  const retirementContribution = Math.max(0, input.retirementContribution);
  const stateTaxRate = Math.max(0, input.stateTaxRate) / 100;
  const netSelfEmploymentIncome = Math.max(0, sideIncome - businessExpenses);
  const selfEmploymentTaxable = netSelfEmploymentIncome * 0.9235;
  const selfEmploymentTax = selfEmploymentTaxable * 0.153;
  const selfEmploymentDeduction = selfEmploymentTax * 0.5;
  const taxableIncome = Math.max(
    0,
    salary + netSelfEmploymentIncome - standardDeduction(input.filingStatus) - selfEmploymentDeduction - retirementContribution
  );
  const federalTax = calculateFederalTax(taxableIncome, input.filingStatus);
  const stateTax = taxableIncome * stateTaxRate;
  const federalAndStateTax = federalTax + stateTax;
  const totalTax = selfEmploymentTax + federalAndStateTax;
  const totalIncome = salary + netSelfEmploymentIncome;
  const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;
  const quarterlyPayment = totalTax / 4;
  const taxTone = effectiveRate >= 30 ? "high" : effectiveRate >= 18 ? "medium" : "low";

  return {
    netSelfEmploymentIncome,
    selfEmploymentTax,
    federalTax,
    stateTax,
    federalAndStateTax,
    totalTax,
    taxableIncome,
    effectiveRate,
    quarterlyPayment,
    formattedNetSelfEmploymentIncome: formatMoney(netSelfEmploymentIncome),
    formattedSelfEmploymentTax: formatMoney(selfEmploymentTax),
    formattedFederalAndStateTax: formatMoney(federalAndStateTax),
    formattedTotalTax: formatMoney(totalTax),
    formattedTaxableIncome: formatMoney(taxableIncome),
    formattedEffectiveRate: `${effectiveRate.toFixed(1)}%`,
    formattedQuarterlyPayment: formatMoney(quarterlyPayment),
    taxTone,
    summary: `${formatMoney(quarterlyPayment)} estimated quarterly payment on ${formatMoney(netSelfEmploymentIncome)} net side income`
  };
}
