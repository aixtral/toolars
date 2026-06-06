import { APPROVED_CALCULATOR_SLUGS } from '@/data/calculators';
import type {
  CalculatorInputValue,
  CalculatorOutputValue,
  CalculatorSlug,
} from '@/lib/calculators';

export type CalculatorRiskLevel = 'high' | 'medium' | 'low';
export type CalculatorFormulaDomain = 'health' | 'finance' | 'utility';

export interface CalculatorQualityProfile {
  slug: CalculatorSlug;
  riskLevel: CalculatorRiskLevel;
  domain: CalculatorFormulaDomain;
  rationale: string;
}

export interface CalculatorGoldenCase {
  slug: CalculatorSlug;
  name: string;
  source: {
    name: string;
    url: string;
    note: string;
  };
  inputs: Record<string, CalculatorInputValue>;
  expected: {
    primaryLabel?: string;
    primaryValue: number;
    precision?: number;
    values?: Record<string, CalculatorOutputValue>;
  };
}

const healthDomainSlugs = new Set<CalculatorSlug>([
  '30-30-30-method',
  'alcohol-metabolism',
  'biological-age',
  'blood-pressure',
  'bmi-calculator',
  'bmr-calculator',
  'body-fat-calculator',
  'body-recomposition',
  'caffeine-calculator',
  'calorie-deficit',
  'child-growth',
  'drink-calories',
  'fiber-intake',
  'gad7-anxiety',
  'glp1-eligibility',
  'glp1-nutrition',
  'glycemic-load',
  'heart-rate-zone',
  'homa-ir',
  'ideal-weight-calculator',
  'intermittent-fasting',
  'lean-body-mass',
  'macro-calculator',
  'one-rep-max',
  'ovulation-calculator',
  'phq9-depression',
  'pregnancy-due-date',
  'protein-calculator',
  'pss10-stress',
  'running-pace',
  'sleep-calculator',
  'smoke-free',
  'steps-to-calories',
  'tdee-calculator',
  'testosterone-calculator',
  'vo2-max',
  'waist-hip-ratio',
  'water-intake',
]);

const utilitySlugs = new Set<CalculatorSlug>([
  'city-cost-comparison',
  'currency-converter',
  'discount-calculator',
  'habit-cost',
  'hourly-to-salary',
  'percentage-calculator',
  'tip-calculator',
]);

export const HIGH_RISK_CALCULATOR_SLUGS = [
  'apy-calculator',
  'blood-pressure',
  'bmi-calculator',
  'bmr-calculator',
  'compound-interest',
  'debt-payoff',
  'gad7-anxiety',
  'glp1-eligibility',
  'homa-ir',
  'loan-calculator',
  'mortgage-calculator',
  'phq9-depression',
] as const satisfies readonly CalculatorSlug[];

const highRiskSlugSet = new Set<CalculatorSlug>(HIGH_RISK_CALCULATOR_SLUGS);

const lowRiskSlugSet = new Set<CalculatorSlug>([
  'currency-converter',
  'discount-calculator',
  'drink-calories',
  'habit-cost',
  'hourly-to-salary',
  'percentage-calculator',
  'running-pace',
  'tip-calculator',
  'water-intake',
]);

function domainFor(slug: CalculatorSlug): CalculatorFormulaDomain {
  if (utilitySlugs.has(slug)) return 'utility';
  return healthDomainSlugs.has(slug) ? 'health' : 'finance';
}

function riskFor(slug: CalculatorSlug): CalculatorRiskLevel {
  if (highRiskSlugSet.has(slug)) return 'high';
  if (lowRiskSlugSet.has(slug)) return 'low';
  return 'medium';
}

function rationaleFor(slug: CalculatorSlug, riskLevel: CalculatorRiskLevel) {
  if (riskLevel === 'high') {
    return `${slug} uses health or finance thresholds where source-backed golden fixtures are required.`;
  }

  if (riskLevel === 'medium') {
    return `${slug} can influence planning decisions but remains an estimate with formula-specific follow-up coverage.`;
  }

  return `${slug} is a low-risk arithmetic or conversion utility with simple deterministic outputs.`;
}

export const CALCULATOR_QUALITY_PROFILES: readonly CalculatorQualityProfile[] =
  APPROVED_CALCULATOR_SLUGS.map((slug) => {
    const riskLevel = riskFor(slug);
    return {
      slug,
      riskLevel,
      domain: domainFor(slug),
      rationale: rationaleFor(slug, riskLevel),
    };
  });

const SOURCES = {
  cdcBmi: {
    name: 'CDC Adult BMI Categories',
    url: 'https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html',
    note: 'Adult BMI categories use normal below 25, overweight below 30, and obesity at 30 or higher.',
  },
  ahaBloodPressure: {
    name: 'American Heart Association Blood Pressure Readings',
    url: 'https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings',
    note: 'AHA blood pressure categories place Stage 1 at 130-139 systolic or 80-89 diastolic.',
  },
  mifflinStJeor: {
    name: 'Mifflin-St Jeor Resting Metabolic Rate Equation',
    url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
    note: 'The equation estimates resting energy expenditure from weight, height, age, and sex offset.',
  },
  gad7: {
    name: 'GAD-7 Severity Scoring',
    url: 'https://pubmed.ncbi.nlm.nih.gov/16717171/',
    note: 'The original GAD-7 validation supports total score severity bands used for screening.',
  },
  glp1Label: {
    name: 'FDA Wegovy Prescribing Information',
    url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/215256s007lbl.pdf',
    note: 'The label describes adult weight-management BMI thresholds of 30 or 27 with a weight-related condition.',
  },
  homaIr: {
    name: 'Homeostasis Model Assessment',
    url: 'https://pubmed.ncbi.nlm.nih.gov/3899825/',
    note: 'HOMA-IR estimates insulin resistance from fasting glucose and fasting insulin.',
  },
  regulationDdApy: {
    name: 'Regulation DD Appendix A',
    url: 'https://www.consumerfinance.gov/rules-policy/regulations/1030/a/',
    note: 'Regulation DD Appendix A documents annual percentage yield calculations for deposit accounts.',
  },
  investorCompound: {
    name: 'Investor.gov Compound Interest Calculator',
    url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
    note: 'Compound interest projections combine starting amount, contributions, rate, and time.',
  },
  cfpbAmortization: {
    name: 'CFPB Amortization Guidance',
    url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-amortization-en-820/',
    note: 'Loan amortization spreads principal and interest payments across the repayment term.',
  },
  phq9: {
    name: 'PHQ-9 Severity Scoring',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK519704/table/ch3.t3/',
    note: 'PHQ-9 total scores map to minimal, mild, moderate, moderately severe, and severe bands.',
  },
} as const;

export const CALCULATOR_GOLDEN_CASES: readonly CalculatorGoldenCase[] = [
  {
    slug: 'apy-calculator',
    name: 'monthly compounding APY',
    source: SOURCES.regulationDdApy,
    inputs: { annualRate: 5, compoundsPerYear: 12 },
    expected: { primaryLabel: 'APY', primaryValue: 5.12, values: { effectiveRate: 5.12 } },
  },
  {
    slug: 'apy-calculator',
    name: 'quarterly compounding APY',
    source: SOURCES.regulationDdApy,
    inputs: { annualRate: 4, compoundsPerYear: 4 },
    expected: { primaryLabel: 'APY', primaryValue: 4.06, values: { effectiveRate: 4.06 } },
  },
  {
    slug: 'blood-pressure',
    name: 'stage one blood pressure boundary',
    source: SOURCES.ahaBloodPressure,
    inputs: { systolic: 130, diastolic: 80 },
    expected: { primaryLabel: 'Systolic pressure', primaryValue: 130, values: { diastolic: 80, category: 'Stage 1 hypertension' } },
  },
  {
    slug: 'blood-pressure',
    name: 'stage two blood pressure boundary',
    source: SOURCES.ahaBloodPressure,
    inputs: { systolic: 140, diastolic: 90 },
    expected: { primaryLabel: 'Systolic pressure', primaryValue: 140, values: { diastolic: 90, category: 'Stage 2 hypertension' } },
  },
  {
    slug: 'bmi-calculator',
    name: 'adult normal BMI upper band',
    source: SOURCES.cdcBmi,
    inputs: { heightCm: 170, weightKg: 72 },
    expected: { primaryLabel: 'BMI', primaryValue: 24.9, precision: 1, values: { category: 'Normal' } },
  },
  {
    slug: 'bmi-calculator',
    name: 'adult overweight BMI band',
    source: SOURCES.cdcBmi,
    inputs: { heightCm: 170, weightKg: 85 },
    expected: { primaryLabel: 'BMI', primaryValue: 29.4, precision: 1, values: { category: 'Overweight' } },
  },
  {
    slug: 'bmr-calculator',
    name: 'male Mifflin-St Jeor BMR',
    source: SOURCES.mifflinStJeor,
    inputs: { weightKg: 70, heightCm: 170, age: 35, sex: 'male' },
    expected: { primaryLabel: 'BMR', primaryValue: 1592.5 },
  },
  {
    slug: 'bmr-calculator',
    name: 'female Mifflin-St Jeor BMR',
    source: SOURCES.mifflinStJeor,
    inputs: { weightKg: 60, heightCm: 165, age: 30, sex: 'female' },
    expected: { primaryLabel: 'BMR', primaryValue: 1320.25 },
  },
  {
    slug: 'compound-interest',
    name: 'one year monthly contribution growth',
    source: SOURCES.investorCompound,
    inputs: { principal: 1000, monthlyContribution: 100, annualRate: 12, years: 1 },
    expected: { primaryLabel: 'Future value', primaryValue: 2395.08, values: { totalContributions: 1200, interest: 195.08 } },
  },
  {
    slug: 'compound-interest',
    name: 'ten year monthly contribution growth',
    source: SOURCES.investorCompound,
    inputs: { principal: 5000, monthlyContribution: 250, annualRate: 6, years: 10 },
    expected: { primaryLabel: 'Future value', primaryValue: 50066.82, values: { totalContributions: 30000, interest: 15066.82 } },
  },
  {
    slug: 'debt-payoff',
    name: 'amortized debt payoff with interest',
    source: SOURCES.cfpbAmortization,
    inputs: { balance: 10000, annualRate: 18, monthlyPayment: 500 },
    expected: { primaryLabel: 'Months to payoff', primaryValue: 24, values: { totalPaid: 12000 } },
  },
  {
    slug: 'debt-payoff',
    name: 'zero-interest debt payoff',
    source: SOURCES.cfpbAmortization,
    inputs: { balance: 2400, annualRate: 0, monthlyPayment: 200 },
    expected: { primaryLabel: 'Months to payoff', primaryValue: 12, values: { totalPaid: 2400 } },
  },
  {
    slug: 'gad7-anxiety',
    name: 'mild GAD-7 band',
    source: SOURCES.gad7,
    inputs: { score: 8 },
    expected: { primaryLabel: 'GAD-7 score', primaryValue: 8, values: { severity: 'Mild' } },
  },
  {
    slug: 'gad7-anxiety',
    name: 'severe GAD-7 band',
    source: SOURCES.gad7,
    inputs: { score: 16 },
    expected: { primaryLabel: 'GAD-7 score', primaryValue: 16, values: { severity: 'Severe' } },
  },
  {
    slug: 'glp1-eligibility',
    name: 'BMI 30 or greater eligibility threshold',
    source: SOURCES.glp1Label,
    inputs: { heightCm: 170, weightKg: 95, riskFactors: 0 },
    expected: { primaryLabel: 'BMI', primaryValue: 32.87, values: { eligible: true, category: 'Potentially eligible' } },
  },
  {
    slug: 'glp1-eligibility',
    name: 'BMI 27 with risk factor eligibility threshold',
    source: SOURCES.glp1Label,
    inputs: { heightCm: 172, weightKg: 82, riskFactors: 1 },
    expected: { primaryLabel: 'BMI', primaryValue: 27.72, values: { eligible: true, category: 'Potentially eligible' } },
  },
  {
    slug: 'homa-ir',
    name: 'fasting glucose and insulin HOMA-IR',
    source: SOURCES.homaIr,
    inputs: { glucoseMgDl: 95, insulinUiuMl: 8 },
    expected: { primaryLabel: 'HOMA-IR', primaryValue: 1.88 },
  },
  {
    slug: 'homa-ir',
    name: 'higher fasting insulin HOMA-IR',
    source: SOURCES.homaIr,
    inputs: { glucoseMgDl: 100, insulinUiuMl: 12 },
    expected: { primaryLabel: 'HOMA-IR', primaryValue: 2.96 },
  },
  {
    slug: 'loan-calculator',
    name: 'five year amortized loan',
    source: SOURCES.cfpbAmortization,
    inputs: { loanAmount: 25000, annualRate: 8, years: 5 },
    expected: { primaryLabel: 'Monthly payment', primaryValue: 506.91, values: { totalInterest: 5414.59 } },
  },
  {
    slug: 'loan-calculator',
    name: 'zero-interest loan',
    source: SOURCES.cfpbAmortization,
    inputs: { loanAmount: 10000, annualRate: 0, years: 4 },
    expected: { primaryLabel: 'Monthly payment', primaryValue: 208.33, values: { totalInterest: 0 } },
  },
  {
    slug: 'mortgage-calculator',
    name: 'thirty year fixed mortgage',
    source: SOURCES.cfpbAmortization,
    inputs: { loanAmount: 300000, annualRate: 6, years: 30 },
    expected: { primaryLabel: 'Monthly payment', primaryValue: 1798.65, values: { totalInterest: 347514.57, totalCost: 647514.57 } },
  },
  {
    slug: 'mortgage-calculator',
    name: 'smaller thirty year mortgage',
    source: SOURCES.cfpbAmortization,
    inputs: { loanAmount: 100000, annualRate: 4, years: 30 },
    expected: { primaryLabel: 'Monthly payment', primaryValue: 477.42, values: { totalInterest: 71869.51, totalCost: 171869.51 } },
  },
  {
    slug: 'phq9-depression',
    name: 'moderate PHQ-9 band',
    source: SOURCES.phq9,
    inputs: { score: 14 },
    expected: { primaryLabel: 'PHQ-9 score', primaryValue: 14, values: { severity: 'Moderate' } },
  },
  {
    slug: 'phq9-depression',
    name: 'severe PHQ-9 band',
    source: SOURCES.phq9,
    inputs: { score: 24 },
    expected: { primaryLabel: 'PHQ-9 score', primaryValue: 24, values: { severity: 'Severe' } },
  },
];

const qualityProfilesBySlug = new Map(
  CALCULATOR_QUALITY_PROFILES.map((profile) => [profile.slug, profile]),
);

export function getCalculatorQualityProfile(slug: CalculatorSlug) {
  const profile = qualityProfilesBySlug.get(slug);
  if (!profile) {
    throw new Error(`Calculator ${slug} is missing quality metadata.`);
  }
  return profile;
}

export function getGoldenCasesForCalculator(slug: CalculatorSlug) {
  return CALCULATOR_GOLDEN_CASES.filter((goldenCase) => goldenCase.slug === slug);
}
