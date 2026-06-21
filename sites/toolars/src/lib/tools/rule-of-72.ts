export interface RuleOf72Input {
  annualReturn: number;
  principal: number;
}

export interface RuleOf72ScheduleRow {
  year: number;
  formattedValue: string;
  formattedGrowth: string;
}

export interface RuleOf72Result {
  ruleYears: number;
  exactYears: number;
  doubledValue: number;
  reverseTenYearRate: number;
  formattedRuleYears: string;
  formattedExactYears: string;
  formattedDoubledValue: string;
  formattedReverseTenYearRate: string;
  accuracyTone: "close" | "rough";
  summary: string;
  schedule: RuleOf72ScheduleRow[];
}

export const defaultRuleOf72Scenario: RuleOf72Input = {
  annualReturn: 7,
  principal: 10000
};

const dollars = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "USD"
});

function formatMoney(value: number) {
  return dollars.format(Math.round(value));
}

export function calculateRuleOf72(input: RuleOf72Input): RuleOf72Result {
  const annualReturn = input.annualReturn;
  const principal = Math.max(0, input.principal);
  const rate = annualReturn / 100;
  const ruleYears = annualReturn > 0 ? 72 / annualReturn : 0;
  const exactYears = rate > -1 && rate !== 0 ? Math.log(2) / Math.log(1 + rate) : 0;
  const doubledValue = principal * 2;
  const reverseTenYearRate = 72 / 10;
  const accuracyTone = annualReturn >= 6 && annualReturn <= 10 ? "close" : "rough";
  const schedule: RuleOf72ScheduleRow[] = [];
  let value = principal;

  for (let year = 1; year <= Math.min(Math.ceil(exactYears) + 2, 40); year += 1) {
    const previous = value;
    value *= 1 + rate;
    schedule.push({
      year,
      formattedValue: formatMoney(value),
      formattedGrowth: `+${formatMoney(value - previous)}`
    });
  }

  const formattedRuleYears = `${ruleYears.toFixed(1)} years`;

  return {
    ruleYears,
    exactYears,
    doubledValue,
    reverseTenYearRate,
    formattedRuleYears,
    formattedExactYears: `${exactYears.toFixed(2)} years`,
    formattedDoubledValue: formatMoney(doubledValue),
    formattedReverseTenYearRate: `${reverseTenYearRate.toFixed(1)}%`,
    accuracyTone,
    summary: `Rule of 72 estimates ${formattedRuleYears} to double at ${annualReturn.toFixed(2)}%`,
    schedule
  };
}
