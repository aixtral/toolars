import type { CalculatorDefinition, ToolCategory } from '@/data/types';

const calculatorSlugs = [
  '30-30-30-method',
  'alcohol-metabolism',
  'apy-calculator',
  'biological-age',
  'blood-pressure',
  'bmi-calculator',
  'bmr-calculator',
  'body-fat-calculator',
  'body-recomposition',
  'budget-rule',
  'caffeine-calculator',
  'calorie-deficit',
  'car-loan',
  'child-growth',
  'city-cost-comparison',
  'coast-fire',
  'compound-interest',
  'credit-card-apr',
  'credit-score-simulator',
  'crypto-tax',
  'currency-converter',
  'debt-payoff',
  'discount-calculator',
  'dividend-reinvestment',
  'drink-calories',
  'dti-calculator',
  'emergency-fund',
  'fiber-intake',
  'fire-calculator',
  'gad7-anxiety',
  'glp1-eligibility',
  'glp1-nutrition',
  'glycemic-load',
  'habit-cost',
  'heart-rate-zone',
  'homa-ir',
  'hourly-to-salary',
  'ideal-weight-calculator',
  'income-tax',
  'inflation-calculator',
  'intermittent-fasting',
  'investment-fee',
  'investment-goal',
  'lean-body-mass',
  'loan-calculator',
  'macro-calculator',
  'mortgage-calculator',
  'net-worth-calculator',
  'one-rep-max',
  'ovulation-calculator',
  'percentage-calculator',
  'phq9-depression',
  'pregnancy-due-date',
  'protein-calculator',
  'pss10-stress',
  'rent-vs-buy',
  'retirement-calculator',
  'roi-calculator',
  'rule-of-72',
  'running-pace',
  'savings-goal',
  'side-income-tax',
  'sip-calculator',
  'sleep-calculator',
  'smoke-free',
  'steps-to-calories',
  'stock-average',
  'tdee-calculator',
  'testosterone-calculator',
  'tip-calculator',
  'vo2-max',
  'waist-hip-ratio',
  'water-intake',
] as const;

type CalculatorSlug = (typeof calculatorSlugs)[number];

const titleOverrides: Partial<Record<CalculatorSlug, string>> = {
  '30-30-30-method': '30-30-30 Method Calculator',
  'alcohol-metabolism': 'Alcohol Metabolism Calculator',
  'apy-calculator': 'APY Calculator',
  'biological-age': 'Biological Age Calculator',
  'blood-pressure': 'Blood Pressure Calculator',
  'bmi-calculator': 'BMI Calculator',
  'bmr-calculator': 'BMR Calculator',
  'body-fat-calculator': 'Body Fat Calculator',
  'body-recomposition': 'Body Recomposition Calculator',
  'budget-rule': '50/30/20 Budget Calculator',
  'caffeine-calculator': 'Caffeine Calculator',
  'calorie-deficit': 'Calorie Deficit Calculator',
  'car-loan': 'Car Loan Calculator',
  'child-growth': 'Child Growth Calculator',
  'city-cost-comparison': 'City Cost Comparison',
  'coast-fire': 'Coast FIRE Calculator',
  'compound-interest': 'Compound Interest Calculator',
  'credit-card-apr': 'Credit Card APR Calculator',
  'credit-score-simulator': 'Credit Score Simulator',
  'crypto-tax': 'Crypto Tax Calculator',
  'currency-converter': 'Currency Converter',
  'debt-payoff': 'Debt Payoff Calculator',
  'discount-calculator': 'Discount Calculator',
  'dividend-reinvestment': 'Dividend Reinvestment Calculator',
  'drink-calories': 'Drink Calories Calculator',
  'dti-calculator': 'DTI Calculator',
  'emergency-fund': 'Emergency Fund Calculator',
  'fiber-intake': 'Fiber Intake Calculator',
  'fire-calculator': 'FIRE Calculator',
  'gad7-anxiety': 'GAD-7 Anxiety Screening',
  'glp1-eligibility': 'GLP-1 Eligibility Checker',
  'glp1-nutrition': 'GLP-1 Nutrition Calculator',
  'glycemic-load': 'Glycemic Load Calculator',
  'habit-cost': 'Habit Cost Calculator',
  'heart-rate-zone': 'Heart Rate Zone Calculator',
  'homa-ir': 'HOMA-IR Calculator',
  'hourly-to-salary': 'Hourly to Salary Calculator',
  'ideal-weight-calculator': 'Ideal Weight Calculator',
  'income-tax': 'Income Tax Calculator',
  'inflation-calculator': 'Inflation Calculator',
  'intermittent-fasting': 'Intermittent Fasting Calculator',
  'investment-fee': 'Investment Fee Calculator',
  'investment-goal': 'Investment Goal Calculator',
  'lean-body-mass': 'Lean Body Mass Calculator',
  'loan-calculator': 'Loan Calculator',
  'macro-calculator': 'Macro Calculator',
  'mortgage-calculator': 'Mortgage Calculator',
  'net-worth-calculator': 'Net Worth Calculator',
  'one-rep-max': 'One Rep Max Calculator',
  'ovulation-calculator': 'Ovulation Calculator',
  'percentage-calculator': 'Percentage Calculator',
  'phq9-depression': 'PHQ-9 Depression Screening',
  'pregnancy-due-date': 'Pregnancy Due Date Calculator',
  'protein-calculator': 'Protein Calculator',
  'pss10-stress': 'PSS-10 Stress Scale',
  'rent-vs-buy': 'Rent vs Buy Calculator',
  'retirement-calculator': 'Retirement Calculator',
  'roi-calculator': 'ROI Calculator',
  'rule-of-72': 'Rule of 72 Calculator',
  'running-pace': 'Running Pace Calculator',
  'savings-goal': 'Savings Goal Calculator',
  'side-income-tax': 'Side Income Tax Calculator',
  'sip-calculator': 'SIP Calculator',
  'sleep-calculator': 'Sleep Calculator',
  'smoke-free': 'Quit Smoking Calculator',
  'steps-to-calories': 'Steps to Calories Calculator',
  'stock-average': 'Stock Average Calculator',
  'tdee-calculator': 'TDEE Calculator',
  'testosterone-calculator': 'Testosterone Calculator',
  'tip-calculator': 'Tip Calculator',
  'vo2-max': 'VO2 Max Calculator',
  'waist-hip-ratio': 'Waist-to-Hip Ratio Calculator',
  'water-intake': 'Water Intake Calculator',
};

const descriptions: Partial<Record<CalculatorSlug, string>> = {
  'apy-calculator':
    'Compare annual yield across interest rates and compounding frequencies.',
  'bmi-calculator':
    'Calculate Body Mass Index from height and weight, then review the healthy range.',
  'compound-interest':
    'Project how money can grow over time with recurring deposits and compound interest.',
  'credit-score-simulator':
    'Estimate how payments, balances, utilization, and new accounts may affect credit score.',
  'glp1-eligibility':
    'Check GLP-1 medication eligibility using BMI, health conditions, and risk factors.',
  'mortgage-calculator':
    'Estimate monthly mortgage payment, total interest, and amortization for a home loan.',
};

const extraKeywords: Partial<Record<CalculatorSlug, readonly string[]>> = {
  'apy-calculator': ['annual percentage yield', 'annual yield'],
  'bmi-calculator': ['body mass index'],
  'mortgage-calculator': ['monthly payment', 'home loan', 'amortization'],
};

const popularSlugs = new Set<CalculatorSlug>([
  'bmi-calculator',
  'mortgage-calculator',
  'compound-interest',
  'loan-calculator',
  'tdee-calculator',
  'retirement-calculator',
  'protein-calculator',
  'debt-payoff',
]);

const categoryGroups: Record<ToolCategory, readonly CalculatorSlug[]> = {
  'ai-content': [],
  body: [
    'biological-age',
    'bmi-calculator',
    'body-fat-calculator',
    'child-growth',
    'glp1-eligibility',
    'ideal-weight-calculator',
    'lean-body-mass',
    'testosterone-calculator',
    'waist-hip-ratio',
  ],
  'fitness-nutrition': [
    '30-30-30-method',
    'bmr-calculator',
    'body-recomposition',
    'caffeine-calculator',
    'calorie-deficit',
    'drink-calories',
    'fiber-intake',
    'glp1-nutrition',
    'glycemic-load',
    'heart-rate-zone',
    'homa-ir',
    'intermittent-fasting',
    'macro-calculator',
    'one-rep-max',
    'protein-calculator',
    'running-pace',
    'steps-to-calories',
    'tdee-calculator',
    'vo2-max',
    'water-intake',
  ],
  wellness: [
    'alcohol-metabolism',
    'blood-pressure',
    'gad7-anxiety',
    'ovulation-calculator',
    'phq9-depression',
    'pregnancy-due-date',
    'pss10-stress',
    'sleep-calculator',
    'smoke-free',
  ],
  wealth: [
    'apy-calculator',
    'coast-fire',
    'compound-interest',
    'dividend-reinvestment',
    'emergency-fund',
    'fire-calculator',
    'inflation-calculator',
    'investment-fee',
    'investment-goal',
    'net-worth-calculator',
    'retirement-calculator',
    'roi-calculator',
    'rule-of-72',
    'savings-goal',
    'sip-calculator',
    'stock-average',
  ],
  finance: [
    'budget-rule',
    'car-loan',
    'city-cost-comparison',
    'credit-card-apr',
    'credit-score-simulator',
    'crypto-tax',
    'currency-converter',
    'debt-payoff',
    'discount-calculator',
    'dti-calculator',
    'habit-cost',
    'hourly-to-salary',
    'income-tax',
    'loan-calculator',
    'mortgage-calculator',
    'percentage-calculator',
    'rent-vs-buy',
    'side-income-tax',
    'tip-calculator',
  ],
};

const categoryBySlug = new Map<CalculatorSlug, ToolCategory>(
  Object.entries(categoryGroups).flatMap(([category, slugs]) =>
    slugs.map((slug) => [slug, category as ToolCategory]),
  ),
);

const iconByCategory: Record<ToolCategory, string> = {
  'ai-content': 'sparkles',
  body: 'scale',
  'fitness-nutrition': 'activity',
  wellness: 'heart',
  wealth: 'trending-up',
  finance: 'wallet',
};

function titleFromSlug(slug: CalculatorSlug) {
  return (
    titleOverrides[slug] ??
    slug
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  );
}

function descriptionFor(slug: CalculatorSlug, title: string) {
  return (
    descriptions[slug] ??
    `Use ${title} for a fast, privacy-aware estimate with clear inputs, result summaries, and related tool guidance.`
  );
}

function keywordsFor(slug: CalculatorSlug, title: string) {
  return Array.from(
    new Set([
      ...slug.split('-'),
      ...title.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
      ...(extraKeywords[slug] ?? []),
      'calculator',
      'free',
      'tool',
    ]),
  );
}

export const CALCULATOR_TOOLS: readonly CalculatorDefinition[] = calculatorSlugs.map(
  (slug) => {
    const category = categoryBySlug.get(slug);
    if (!category) {
      throw new Error(`Calculator ${slug} is missing a toolars category.`);
    }

    const title = titleFromSlug(slug);
    const description = descriptionFor(slug, title);

    return {
      slug,
      sourceSlug: slug,
      title,
      type: 'calculator',
      category,
      icon: iconByCategory[category],
      description,
      route: `/tools/${slug}`,
      badges: ['Free', 'No login'],
      isPopular: popularSlugs.has(slug),
      requiresAccount: false,
      sourceProject: 'aixtral-calm/vitalcalc',
      formulaStatus: 'ported',
      seo: {
        title: `${title} | Free Online Tool - toolars`,
        description,
        keywords: keywordsFor(slug, title),
      },
    };
  },
);

export const APPROVED_CALCULATOR_SLUGS = calculatorSlugs;
