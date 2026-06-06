import { APPROVED_CALCULATOR_SLUGS } from '@/data/calculators';
import { roundTo } from '@/lib/formatting';

export type CalculatorSlug = (typeof APPROVED_CALCULATOR_SLUGS)[number];
export type CalculatorInputValue = number | string | boolean | undefined;
export type CalculatorInputs = Record<string, CalculatorInputValue>;
export type CalculatorOutputValue = number | string | boolean;

export interface CalculatorInputDefinition {
  name: string;
  label: string;
  defaultValue: number | string | boolean;
  unit?: string;
  min?: number;
  max?: number;
}

export interface CalculatorValidationError {
  field: string;
  message: string;
}

export interface CalculatorSuccess {
  ok: true;
  slug: CalculatorSlug;
  primaryLabel: string;
  primaryValue: number;
  values: Record<string, CalculatorOutputValue>;
  formulaLabel: string;
}

export interface CalculatorFailure {
  ok: false;
  slug: CalculatorSlug;
  errors: CalculatorValidationError[];
}

export type CalculatorResult = CalculatorSuccess | CalculatorFailure;

export interface CalculatorEngine {
  slug: CalculatorSlug;
  title: string;
  formulaLabel: string;
  inputs: readonly CalculatorInputDefinition[];
  calculate: (inputs?: CalculatorInputs) => CalculatorResult;
}

interface NumberOptions {
  defaultValue: number;
  label: string;
  min?: number;
  minExclusive?: number;
  max?: number;
}

type Compute = (
  values: Record<string, number>,
  raw: CalculatorInputs,
) => Omit<CalculatorSuccess, 'ok' | 'slug' | 'formulaLabel'>;

export const CALCULATOR_ENGINE_SLUGS = APPROVED_CALCULATOR_SLUGS;

function input(
  name: string,
  label: string,
  defaultValue: number | string | boolean,
  unit?: string,
  min?: number,
  max?: number,
): CalculatorInputDefinition {
  return { name, label, defaultValue, unit, min, max };
}

function readNumber(
  raw: CalculatorInputs,
  errors: CalculatorValidationError[],
  field: string,
  options: NumberOptions,
) {
  const value = raw[field] ?? options.defaultValue;
  const numberValue = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(numberValue)) {
    errors.push({ field, message: `${options.label} must be a valid number.` });
    return options.defaultValue;
  }

  if (options.minExclusive !== undefined && numberValue <= options.minExclusive) {
    errors.push({
      field,
      message: `${options.label} must be greater than ${options.minExclusive}.`,
    });
  }

  if (options.min !== undefined && numberValue < options.min) {
    errors.push({ field, message: `${options.label} must be at least ${options.min}.` });
  }

  if (options.max !== undefined && numberValue > options.max) {
    errors.push({ field, message: `${options.label} must be at most ${options.max}.` });
  }

  return numberValue;
}

function readText(raw: CalculatorInputs, field: string, fallback: string) {
  const value = raw[field];
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function buildEngine(
  slug: CalculatorSlug,
  title: string,
  formulaLabel: string,
  inputs: readonly CalculatorInputDefinition[],
  compute: Compute,
): CalculatorEngine {
  return {
    slug,
    title,
    formulaLabel,
    inputs,
    calculate(raw = {}) {
      const errors: CalculatorValidationError[] = [];
      const values: Record<string, number> = {};

      for (const definition of inputs) {
        if (typeof definition.defaultValue !== 'number') continue;
        values[definition.name] = readNumber(raw, errors, definition.name, {
          defaultValue: definition.defaultValue,
          label: definition.label,
          min: definition.min,
          max: definition.max,
        });
      }

      if (errors.length > 0) return { ok: false, slug, errors };

      return {
        ok: true,
        slug,
        formulaLabel,
        ...compute(values, raw),
      };
    },
  };
}

function positiveEngine(
  slug: CalculatorSlug,
  title: string,
  formulaLabel: string,
  inputs: readonly CalculatorInputDefinition[],
  compute: Compute,
): CalculatorEngine {
  return {
    slug,
    title,
    formulaLabel,
    inputs,
    calculate(raw = {}) {
      const errors: CalculatorValidationError[] = [];
      const values: Record<string, number> = {};

      for (const definition of inputs) {
        if (typeof definition.defaultValue !== 'number') continue;
        values[definition.name] = readNumber(raw, errors, definition.name, {
          defaultValue: definition.defaultValue,
          label: definition.label,
          minExclusive: 0,
        });
      }

      if (errors.length > 0) return { ok: false, slug, errors };

      return {
        ok: true,
        slug,
        formulaLabel,
        ...compute(values, raw),
      };
    },
  };
}

function success(
  primaryLabel: string,
  primaryValue: number,
  values: Record<string, CalculatorOutputValue> = {},
): Omit<CalculatorSuccess, 'ok' | 'slug' | 'formulaLabel'> {
  return { primaryLabel, primaryValue: roundTo(primaryValue, 2), values };
}

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function bloodPressureCategory(systolic: number, diastolic: number) {
  if (systolic > 180 || diastolic > 120) return 'Hypertensive crisis';
  if (systolic >= 140 || diastolic >= 90) return 'Stage 2 hypertension';
  if (systolic >= 130 || diastolic >= 80) return 'Stage 1 hypertension';
  if (systolic >= 120 && diastolic < 80) return 'Elevated';
  return 'Normal';
}

function amortizedPayment(principal: number, annualRate: number, years: number) {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return (
    principal *
    ((monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1))
  );
}

function futureValue(principal: number, monthlyContribution: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  if (monthlyRate === 0) return principal + monthlyContribution * months;
  return (
    principal * (1 + monthlyRate) ** months +
    monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate)
  );
}

function severity(score: number, bands: readonly [number, string][]) {
  return bands.find(([max]) => score <= max)?.[1] ?? bands[bands.length - 1][1];
}

const engines: Record<CalculatorSlug, CalculatorEngine> = {
  '30-30-30-method': positiveEngine(
    '30-30-30-method',
    '30-30-30 Method Calculator',
    'protein = weight × 1.6; movement = 30 minutes',
    [input('weightKg', 'Weight', 80, 'kg')],
    ({ weightKg }) => success('Protein target', weightKg * 1.6, { morningProtein: roundTo(weightKg * 1.6, 1), movementMinutes: 30 }),
  ),
  'alcohol-metabolism': positiveEngine(
    'alcohol-metabolism',
    'Alcohol Metabolism Calculator',
    'hours = drinks × 14g / 7g per hour',
    [input('drinks', 'Standard drinks', 3), input('gramsPerDrink', 'Grams per drink', 14, 'g')],
    ({ drinks, gramsPerDrink }) => success('Estimated hours', (drinks * gramsPerDrink) / 7, { alcoholGrams: roundTo(drinks * gramsPerDrink, 1) }),
  ),
  'apy-calculator': buildEngine(
    'apy-calculator',
    'APY Calculator',
    'APY = (1 + rate / compounds)^compounds - 1',
    [input('annualRate', 'Annual rate', 5, '%', 0), input('compoundsPerYear', 'Compounds per year', 12, undefined, 1)],
    ({ annualRate, compoundsPerYear }) => {
      const apy = ((1 + annualRate / 100 / compoundsPerYear) ** compoundsPerYear - 1) * 100;
      return success('APY', apy, { effectiveRate: roundTo(apy, 2) });
    },
  ),
  'biological-age': buildEngine(
    'biological-age',
    'Biological Age Calculator',
    'biological age = age + lifestyle risk adjustments',
    [input('age', 'Age', 35, 'years', 1), input('sleepHours', 'Sleep', 7, 'hours', 0), input('exerciseDays', 'Exercise days', 3, undefined, 0)],
    ({ age, sleepHours, exerciseDays }) => success('Estimated biological age', age + (sleepHours < 7 ? 2 : -1) + (exerciseDays >= 4 ? -2 : 1)),
  ),
  'blood-pressure': buildEngine(
    'blood-pressure',
    'Blood Pressure Calculator',
    'category from systolic and diastolic thresholds',
    [input('systolic', 'Systolic', 120, 'mmHg', 1), input('diastolic', 'Diastolic', 80, 'mmHg', 1)],
    ({ systolic, diastolic }) => {
      const category = bloodPressureCategory(systolic, diastolic);
      return success('Systolic pressure', systolic, { diastolic, category });
    },
  ),
  'bmi-calculator': {
    slug: 'bmi-calculator',
    title: 'BMI Calculator',
    formulaLabel: 'BMI = weight (kg) / height (m)^2',
    inputs: [input('heightCm', 'Height', 170, 'cm'), input('weightKg', 'Weight', 66, 'kg')],
    calculate(raw = {}) {
      const errors: CalculatorValidationError[] = [];
      const heightCm = readNumber(raw, errors, 'heightCm', {
        defaultValue: 170,
        label: 'Height',
        minExclusive: 0,
      });
      const weightKg = readNumber(raw, errors, 'weightKg', {
        defaultValue: 66,
        label: 'Weight',
        minExclusive: 0,
      });
      if (errors.length > 0) return { ok: false, slug: 'bmi-calculator', errors };
      const bmi = weightKg / (heightCm / 100) ** 2;
      return {
        ok: true,
        slug: 'bmi-calculator',
        formulaLabel: 'BMI = weight (kg) / height (m)^2',
        ...success('BMI', roundTo(bmi, 1), { category: bmiCategory(bmi) }),
      };
    },
  },
  'bmr-calculator': buildEngine(
    'bmr-calculator',
    'BMR Calculator',
    'Mifflin-St Jeor: 10W + 6.25H - 5A + sex offset',
    [input('weightKg', 'Weight', 70, 'kg', 1), input('heightCm', 'Height', 170, 'cm', 1), input('age', 'Age', 35, 'years', 1)],
    ({ weightKg, heightCm, age }, raw) => {
      const sexOffset = readText(raw, 'sex', 'male') === 'female' ? -161 : 5;
      return success('BMR', 10 * weightKg + 6.25 * heightCm - 5 * age + sexOffset);
    },
  ),
  'body-fat-calculator': buildEngine(
    'body-fat-calculator',
    'Body Fat Calculator',
    'U.S. Navy estimate from waist, neck, height, and optional hip',
    [input('waistCm', 'Waist', 85, 'cm', 1), input('neckCm', 'Neck', 38, 'cm', 1), input('heightCm', 'Height', 175, 'cm', 1), input('hipCm', 'Hip', 95, 'cm', 1)],
    ({ waistCm, neckCm, heightCm, hipCm }, raw) => {
      const sex = readText(raw, 'sex', 'male');
      const bf = sex === 'female'
        ? 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.221 * Math.log10(heightCm)) - 450
        : 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
      return success('Body fat', bf, { leanMassPercent: roundTo(100 - bf, 1) });
    },
  ),
  'body-recomposition': buildEngine(
    'body-recomposition',
    'Body Recomposition Calculator',
    'target calories = maintenance - deficit; protein = weight × 1.8',
    [input('maintenanceCalories', 'Maintenance calories', 2400, 'kcal', 1), input('deficitCalories', 'Deficit', 250, 'kcal', 0), input('weightKg', 'Weight', 80, 'kg', 1)],
    ({ maintenanceCalories, deficitCalories, weightKg }) => success('Target calories', maintenanceCalories - deficitCalories, { proteinGrams: roundTo(weightKg * 1.8, 1) }),
  ),
  'budget-rule': buildEngine(
    'budget-rule',
    '50/30/20 Budget Calculator',
    'needs = income × 50%; wants = income × 30%; savings = income × 20%',
    [input('monthlyIncome', 'Monthly income', 5000, '$', 0)],
    ({ monthlyIncome }) => success('Needs budget', monthlyIncome * 0.5, { wants: roundTo(monthlyIncome * 0.3, 2), savings: roundTo(monthlyIncome * 0.2, 2) }),
  ),
  'caffeine-calculator': buildEngine(
    'caffeine-calculator',
    'Caffeine Calculator',
    'safe daily caffeine = min(weight × 6mg, 400mg)',
    [input('weightKg', 'Weight', 70, 'kg', 1)],
    ({ weightKg }) => success('Daily limit', Math.min(weightKg * 6, 400)),
  ),
  'calorie-deficit': buildEngine(
    'calorie-deficit',
    'Calorie Deficit Calculator',
    'target calories = maintenance - weekly loss × 7700 / 7',
    [input('maintenanceCalories', 'Maintenance calories', 2400, 'kcal', 1), input('weeklyLossKg', 'Weekly loss', 0.5, 'kg', 0)],
    ({ maintenanceCalories, weeklyLossKg }) => success('Target calories', maintenanceCalories - (weeklyLossKg * 7700) / 7),
  ),
  'car-loan': buildEngine(
    'car-loan',
    'Car Loan Calculator',
    'payment = amortized principal after down payment',
    [input('price', 'Vehicle price', 30000, '$', 0), input('downPayment', 'Down payment', 5000, '$', 0), input('annualRate', 'Annual rate', 7, '%', 0), input('years', 'Term', 5, 'years', 1)],
    ({ price, downPayment, annualRate, years }) => {
      const principal = Math.max(0, price - downPayment);
      const monthly = amortizedPayment(principal, annualRate, years);
      return success('Monthly payment', monthly, { totalInterest: roundTo(monthly * years * 12 - principal, 2) });
    },
  ),
  'child-growth': buildEngine(
    'child-growth',
    'Child Growth Calculator',
    'child BMI = weight / height^2',
    [input('heightCm', 'Height', 120, 'cm', 1), input('weightKg', 'Weight', 22, 'kg', 1), input('ageYears', 'Age', 7, 'years', 0)],
    ({ heightCm, weightKg, ageYears }) => success('Child BMI', weightKg / (heightCm / 100) ** 2, { ageYears }),
  ),
  'city-cost-comparison': buildEngine(
    'city-cost-comparison',
    'City Cost Comparison',
    'equivalent income = income × target cost index / current cost index',
    [input('currentIncome', 'Current income', 80000, '$', 0), input('currentIndex', 'Current city index', 100, undefined, 1), input('targetIndex', 'Target city index', 120, undefined, 1)],
    ({ currentIncome, currentIndex, targetIndex }) => success('Equivalent income', currentIncome * (targetIndex / currentIndex)),
  ),
  'coast-fire': buildEngine(
    'coast-fire',
    'Coast FIRE Calculator',
    'coast number = retirement need / (1 + return)^years',
    [input('retirementNeed', 'Retirement need', 1000000, '$', 1), input('annualReturn', 'Annual return', 7, '%', 0), input('years', 'Years to retirement', 25, 'years', 1)],
    ({ retirementNeed, annualReturn, years }) => success('Coast FIRE number', retirementNeed / (1 + annualReturn / 100) ** years),
  ),
  'compound-interest': buildEngine(
    'compound-interest',
    'Compound Interest Calculator',
    'A = P(1 + r/12)^(12t) + PMT × (((1 + r/12)^(12t) - 1) / (r/12))',
    [input('principal', 'Principal', 1000, '$', 0), input('monthlyContribution', 'Monthly contribution', 100, '$', 0), input('annualRate', 'Annual rate', 12, '%', 0), input('years', 'Years', 1, 'years', 1)],
    ({ principal, monthlyContribution, annualRate, years }) => {
      const total = futureValue(principal, monthlyContribution, annualRate, years);
      const totalContributions = monthlyContribution * years * 12;
      return success('Future value', total, {
        principal,
        totalContributions: roundTo(totalContributions, 2),
        interest: roundTo(total - principal - totalContributions, 2),
      });
    },
  ),
  'credit-card-apr': buildEngine(
    'credit-card-apr',
    'Credit Card APR Calculator',
    'monthly interest = balance × APR / 12',
    [input('balance', 'Balance', 5000, '$', 0), input('annualRate', 'APR', 22, '%', 0), input('monthlyPayment', 'Monthly payment', 250, '$', 1)],
    ({ balance, annualRate, monthlyPayment }) => {
      const monthlyRate = annualRate / 100 / 12;
      const months = monthlyPayment > balance * monthlyRate ? Math.ceil(-Math.log(1 - (balance * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate)) : 999;
      return success('Months to payoff', months, { firstMonthInterest: roundTo(balance * monthlyRate, 2) });
    },
  ),
  'credit-score-simulator': buildEngine(
    'credit-score-simulator',
    'Credit Score Simulator',
    'score estimate from utilization, payment history, and new accounts',
    [input('currentScore', 'Current score', 700, undefined, 300, 850), input('utilization', 'Utilization', 30, '%', 0), input('latePayments', 'Late payments', 0, undefined, 0), input('newAccounts', 'New accounts', 0, undefined, 0)],
    ({ currentScore, utilization, latePayments, newAccounts }) => success('Simulated score', Math.max(300, Math.min(850, currentScore + (30 - utilization) * 1.2 - latePayments * 35 - newAccounts * 8))),
  ),
  'crypto-tax': buildEngine(
    'crypto-tax',
    'Crypto Tax Calculator',
    'tax = max(sale - cost basis, 0) × tax rate',
    [input('saleValue', 'Sale value', 10000, '$', 0), input('costBasis', 'Cost basis', 7000, '$', 0), input('taxRate', 'Tax rate', 20, '%', 0)],
    ({ saleValue, costBasis, taxRate }) => success('Estimated tax', Math.max(0, saleValue - costBasis) * (taxRate / 100), { gain: roundTo(saleValue - costBasis, 2) }),
  ),
  'currency-converter': buildEngine(
    'currency-converter',
    'Currency Converter',
    'converted amount = amount × exchange rate',
    [input('amount', 'Amount', 100, undefined, 0), input('exchangeRate', 'Exchange rate', 1.08, undefined, 0)],
    ({ amount, exchangeRate }) => success('Converted amount', amount * exchangeRate),
  ),
  'debt-payoff': {
    slug: 'debt-payoff',
    title: 'Debt Payoff Calculator',
    formulaLabel: 'months = amortized payoff from balance, APR, and payment',
    inputs: [
      input('balance', 'Balance', 10000, '$', 0),
      input('annualRate', 'APR', 18, '%', 0),
      input('monthlyPayment', 'Monthly payment', 500, '$', 1),
    ],
    calculate(raw = {}) {
      const errors: CalculatorValidationError[] = [];
      const balance = readNumber(raw, errors, 'balance', {
        defaultValue: 10000,
        label: 'Balance',
        min: 0,
      });
      const annualRate = readNumber(raw, errors, 'annualRate', {
        defaultValue: 18,
        label: 'APR',
        min: 0,
      });
      const monthlyPayment = readNumber(raw, errors, 'monthlyPayment', {
        defaultValue: 500,
        label: 'Monthly payment',
        minExclusive: 0,
      });

      const monthlyRate = annualRate / 100 / 12;
      const firstMonthInterest = balance * monthlyRate;
      if (monthlyRate > 0 && monthlyPayment <= firstMonthInterest) {
        errors.push({
          field: 'monthlyPayment',
          message: 'Monthly payment must exceed first-month interest.',
        });
      }

      if (errors.length > 0) return { ok: false, slug: 'debt-payoff', errors };

      const months =
        monthlyRate === 0
          ? balance / monthlyPayment
          : -Math.log(1 - firstMonthInterest / monthlyPayment) / Math.log(1 + monthlyRate);
      const roundedMonths = Math.ceil(Math.max(0, months));
      return {
        ok: true,
        slug: 'debt-payoff',
        formulaLabel: 'months = amortized payoff from balance, APR, and payment',
        ...success('Months to payoff', roundedMonths, {
          totalPaid: roundTo(roundedMonths * monthlyPayment, 2),
        }),
      };
    },
  },
  'discount-calculator': buildEngine(
    'discount-calculator',
    'Discount Calculator',
    'sale price = original price × (1 - discount rate)',
    [input('originalPrice', 'Original price', 100, '$', 0), input('discountRate', 'Discount rate', 20, '%', 0)],
    ({ originalPrice, discountRate }) => success('Sale price', originalPrice * (1 - discountRate / 100), { savings: roundTo(originalPrice * discountRate / 100, 2) }),
  ),
  'dividend-reinvestment': buildEngine(
    'dividend-reinvestment',
    'Dividend Reinvestment Calculator',
    'future value = principal compounded by yield plus monthly additions',
    [input('principal', 'Principal', 10000, '$', 0), input('monthlyContribution', 'Monthly contribution', 200, '$', 0), input('dividendYield', 'Dividend yield', 4, '%', 0), input('years', 'Years', 10, 'years', 1)],
    ({ principal, monthlyContribution, dividendYield, years }) => success('Future value', futureValue(principal, monthlyContribution, dividendYield, years)),
  ),
  'drink-calories': buildEngine(
    'drink-calories',
    'Drink Calories Calculator',
    'total calories = drinks × calories per drink',
    [input('drinks', 'Drinks', 3, undefined, 0), input('caloriesPerDrink', 'Calories per drink', 150, 'kcal', 0)],
    ({ drinks, caloriesPerDrink }) => success('Total calories', drinks * caloriesPerDrink),
  ),
  'dti-calculator': buildEngine(
    'dti-calculator',
    'DTI Calculator',
    'DTI = monthly debt / gross monthly income',
    [input('monthlyDebt', 'Monthly debt', 1500, '$', 0), input('monthlyIncome', 'Monthly income', 6000, '$', 1)],
    ({ monthlyDebt, monthlyIncome }) => success('Debt-to-income ratio', (monthlyDebt / monthlyIncome) * 100),
  ),
  'emergency-fund': buildEngine(
    'emergency-fund',
    'Emergency Fund Calculator',
    'fund target = monthly essential expenses × months',
    [input('monthlyExpenses', 'Monthly expenses', 3500, '$', 0), input('months', 'Months', 6, undefined, 1)],
    ({ monthlyExpenses, months }) => success('Fund target', monthlyExpenses * months),
  ),
  'fiber-intake': buildEngine(
    'fiber-intake',
    'Fiber Intake Calculator',
    'fiber target = calories / 1000 × 14g',
    [input('calories', 'Calories', 2200, 'kcal', 1)],
    ({ calories }) => success('Daily fiber', (calories / 1000) * 14),
  ),
  'fire-calculator': buildEngine(
    'fire-calculator',
    'FIRE Calculator',
    'FIRE number = annual expenses × 25',
    [input('annualExpenses', 'Annual expenses', 48000, '$', 0)],
    ({ annualExpenses }) => success('FIRE number', annualExpenses * 25),
  ),
  'gad7-anxiety': buildEngine(
    'gad7-anxiety',
    'GAD-7 Anxiety Screening',
    'GAD-7 total = sum of seven item scores',
    [input('score', 'GAD-7 total score', 8, undefined, 0, 21)],
    ({ score }) => success('GAD-7 score', score, { severity: severity(score, [[4, 'Minimal'], [9, 'Mild'], [14, 'Moderate'], [21, 'Severe']]) }),
  ),
  'glp1-eligibility': buildEngine(
    'glp1-eligibility',
    'GLP-1 Eligibility Checker',
    'eligibility from BMI and metabolic risk factors',
    [input('heightCm', 'Height', 170, 'cm', 1), input('weightKg', 'Weight', 95, 'kg', 1), input('riskFactors', 'Risk factors', 1, undefined, 0)],
    ({ heightCm, weightKg, riskFactors }) => {
      const bmi = weightKg / (heightCm / 100) ** 2;
      const eligible = bmi >= 30 || (bmi >= 27 && riskFactors > 0);
      return success('BMI', bmi, { eligible, category: eligible ? 'Potentially eligible' : 'May not qualify' });
    },
  ),
  'glp1-nutrition': buildEngine(
    'glp1-nutrition',
    'GLP-1 Nutrition Calculator',
    'protein = max(weight × 1.2, ideal weight × 1.6)',
    [input('weightKg', 'Weight', 95, 'kg', 1), input('idealWeightKg', 'Ideal weight', 72, 'kg', 1)],
    ({ weightKg, idealWeightKg }) => success('Protein target', Math.max(weightKg * 1.2, idealWeightKg * 1.6), { minimumCalories: 1200 }),
  ),
  'glycemic-load': buildEngine(
    'glycemic-load',
    'Glycemic Load Calculator',
    'glycemic load = GI × available carbs / 100',
    [input('glycemicIndex', 'Glycemic index', 55, undefined, 0), input('carbsGrams', 'Carbs', 30, 'g', 0)],
    ({ glycemicIndex, carbsGrams }) => success('Glycemic load', (glycemicIndex * carbsGrams) / 100),
  ),
  'habit-cost': buildEngine(
    'habit-cost',
    'Habit Cost Calculator',
    'annual habit cost = daily cost × frequency × 52',
    [input('costPerUse', 'Cost per use', 6, '$', 0), input('usesPerWeek', 'Uses per week', 5, undefined, 0)],
    ({ costPerUse, usesPerWeek }) => success('Annual cost', costPerUse * usesPerWeek * 52),
  ),
  'heart-rate-zone': buildEngine(
    'heart-rate-zone',
    'Heart Rate Zone Calculator',
    'max heart rate = 220 - age',
    [input('age', 'Age', 35, 'years', 1), input('restingHeartRate', 'Resting heart rate', 60, 'bpm', 1)],
    ({ age, restingHeartRate }) => {
      const maxHeartRate = 220 - age;
      const reserve = maxHeartRate - restingHeartRate;
      return success('Max heart rate', maxHeartRate, { zone2Low: roundTo(restingHeartRate + reserve * 0.6, 0), zone2High: roundTo(restingHeartRate + reserve * 0.7, 0) });
    },
  ),
  'homa-ir': buildEngine(
    'homa-ir',
    'HOMA-IR Calculator',
    'HOMA-IR = fasting glucose × fasting insulin / 405',
    [input('glucoseMgDl', 'Glucose', 95, 'mg/dL', 1), input('insulinUiuMl', 'Insulin', 8, 'uIU/mL', 1)],
    ({ glucoseMgDl, insulinUiuMl }) => success('HOMA-IR', (glucoseMgDl * insulinUiuMl) / 405),
  ),
  'hourly-to-salary': buildEngine(
    'hourly-to-salary',
    'Hourly to Salary Calculator',
    'annual salary = hourly rate × weekly hours × weeks',
    [input('hourlyRate', 'Hourly rate', 35, '$', 0), input('hoursPerWeek', 'Hours per week', 40, undefined, 0), input('weeksPerYear', 'Weeks per year', 52, undefined, 1)],
    ({ hourlyRate, hoursPerWeek, weeksPerYear }) => success('Annual salary', hourlyRate * hoursPerWeek * weeksPerYear),
  ),
  'ideal-weight-calculator': buildEngine(
    'ideal-weight-calculator',
    'Ideal Weight Calculator',
    'Devine estimate = base weight + 2.3kg per inch over 5ft',
    [input('heightCm', 'Height', 175, 'cm', 120)],
    ({ heightCm }, raw) => {
      const inchesOverFiveFeet = Math.max(0, heightCm / 2.54 - 60);
      const base = readText(raw, 'sex', 'male') === 'female' ? 45.5 : 50;
      return success('Ideal weight', base + 2.3 * inchesOverFiveFeet);
    },
  ),
  'income-tax': buildEngine(
    'income-tax',
    'Income Tax Calculator',
    'tax = taxable income × effective tax rate',
    [input('income', 'Income', 80000, '$', 0), input('deductions', 'Deductions', 13850, '$', 0), input('effectiveRate', 'Effective tax rate', 18, '%', 0)],
    ({ income, deductions, effectiveRate }) => success('Estimated tax', Math.max(0, income - deductions) * effectiveRate / 100),
  ),
  'inflation-calculator': buildEngine(
    'inflation-calculator',
    'Inflation Calculator',
    'future cost = amount × (1 + inflation)^years',
    [input('amount', 'Amount', 1000, '$', 0), input('inflationRate', 'Inflation rate', 3, '%', 0), input('years', 'Years', 10, 'years', 0)],
    ({ amount, inflationRate, years }) => success('Future cost', amount * (1 + inflationRate / 100) ** years),
  ),
  'intermittent-fasting': buildEngine(
    'intermittent-fasting',
    'Intermittent Fasting Calculator',
    'eating duration = 24 - fasting hours',
    [input('fastingHours', 'Fasting hours', 16, 'hours', 1, 23)],
    ({ fastingHours }) => success('Eating duration', 24 - fastingHours),
  ),
  'investment-fee': buildEngine(
    'investment-fee',
    'Investment Fee Calculator',
    'fee drag = gross future value - net future value',
    [input('principal', 'Principal', 100000, '$', 0), input('annualReturn', 'Annual return', 7, '%', 0), input('feeRate', 'Fee rate', 1, '%', 0), input('years', 'Years', 20, 'years', 1)],
    ({ principal, annualReturn, feeRate, years }) => {
      const gross = principal * (1 + annualReturn / 100) ** years;
      const net = principal * (1 + (annualReturn - feeRate) / 100) ** years;
      return success('Fee drag', gross - net, { netValue: roundTo(net, 2), grossValue: roundTo(gross, 2) });
    },
  ),
  'investment-goal': buildEngine(
    'investment-goal',
    'Investment Goal Calculator',
    'monthly investment solves future value target',
    [input('target', 'Target', 100000, '$', 1), input('currentSavings', 'Current savings', 10000, '$', 0), input('annualReturn', 'Annual return', 6, '%', 0), input('years', 'Years', 10, 'years', 1)],
    ({ target, currentSavings, annualReturn, years }) => {
      const monthlyRate = annualReturn / 100 / 12;
      const months = years * 12;
      const futureCurrent = currentSavings * (1 + monthlyRate) ** months;
      const monthly = monthlyRate === 0 ? (target - futureCurrent) / months : ((target - futureCurrent) * monthlyRate) / ((1 + monthlyRate) ** months - 1);
      return success('Monthly investment', Math.max(0, monthly));
    },
  ),
  'lean-body-mass': buildEngine(
    'lean-body-mass',
    'Lean Body Mass Calculator',
    'lean mass = weight × (1 - body fat percentage)',
    [input('weightKg', 'Weight', 80, 'kg', 1), input('bodyFatPercent', 'Body fat', 20, '%', 0, 80)],
    ({ weightKg, bodyFatPercent }) => success('Lean body mass', weightKg * (1 - bodyFatPercent / 100)),
  ),
  'loan-calculator': buildEngine(
    'loan-calculator',
    'Loan Calculator',
    'payment = amortized principal payment',
    [input('loanAmount', 'Loan amount', 25000, '$', 0), input('annualRate', 'Annual rate', 8, '%', 0), input('years', 'Years', 5, 'years', 1)],
    ({ loanAmount, annualRate, years }) => {
      const monthly = amortizedPayment(loanAmount, annualRate, years);
      return success('Monthly payment', monthly, { totalInterest: roundTo(monthly * years * 12 - loanAmount, 2) });
    },
  ),
  'macro-calculator': buildEngine(
    'macro-calculator',
    'Macro Calculator',
    'protein/carbs/fat from calorie split',
    [input('calories', 'Calories', 2200, 'kcal', 1), input('proteinPercent', 'Protein percent', 30, '%', 0), input('fatPercent', 'Fat percent', 30, '%', 0)],
    ({ calories, proteinPercent, fatPercent }) => {
      const carbPercent = Math.max(0, 100 - proteinPercent - fatPercent);
      return success('Protein grams', (calories * proteinPercent / 100) / 4, { carbsGrams: roundTo((calories * carbPercent / 100) / 4, 1), fatGrams: roundTo((calories * fatPercent / 100) / 9, 1) });
    },
  ),
  'mortgage-calculator': buildEngine(
    'mortgage-calculator',
    'Mortgage Calculator',
    'M = P × r(1+r)^n / ((1+r)^n - 1)',
    [input('loanAmount', 'Loan amount', 300000, '$', 0), input('annualRate', 'Annual rate', 6, '%', 0), input('years', 'Years', 30, 'years', 1)],
    ({ loanAmount, annualRate, years }) => {
      const monthly = amortizedPayment(loanAmount, annualRate, years);
      return success('Monthly payment', monthly, { totalInterest: roundTo(monthly * years * 12 - loanAmount, 2), totalCost: roundTo(monthly * years * 12, 2) });
    },
  ),
  'net-worth-calculator': buildEngine(
    'net-worth-calculator',
    'Net Worth Calculator',
    'net worth = assets - liabilities',
    [input('assets', 'Assets', 250000, '$', 0), input('liabilities', 'Liabilities', 80000, '$', 0)],
    ({ assets, liabilities }) => success('Net worth', assets - liabilities),
  ),
  'one-rep-max': buildEngine(
    'one-rep-max',
    'One Rep Max Calculator',
    'Epley estimate = weight × (1 + reps / 30)',
    [input('weight', 'Weight lifted', 100, undefined, 1), input('reps', 'Reps', 5, undefined, 1)],
    ({ weight, reps }) => success('One-rep max', weight * (1 + reps / 30)),
  ),
  'ovulation-calculator': buildEngine(
    'ovulation-calculator',
    'Ovulation Calculator',
    'ovulation day = cycle length - 14',
    [input('cycleLength', 'Cycle length', 28, 'days', 20, 45)],
    ({ cycleLength }) => success('Ovulation day', cycleLength - 14, { fertileWindowStart: cycleLength - 19, fertileWindowEnd: cycleLength - 13 }),
  ),
  'percentage-calculator': buildEngine(
    'percentage-calculator',
    'Percentage Calculator',
    'result = value × percent / 100',
    [input('value', 'Value', 200, undefined, 0), input('percent', 'Percent', 15, '%', 0)],
    ({ value, percent }) => success('Percentage value', value * percent / 100),
  ),
  'phq9-depression': buildEngine(
    'phq9-depression',
    'PHQ-9 Depression Screening',
    'PHQ-9 total = sum of nine item scores',
    [input('score', 'PHQ-9 total score', 9, undefined, 0, 27)],
    ({ score }) => success('PHQ-9 score', score, { severity: severity(score, [[4, 'Minimal'], [9, 'Mild'], [14, 'Moderate'], [19, 'Moderately severe'], [27, 'Severe']]) }),
  ),
  'pregnancy-due-date': buildEngine(
    'pregnancy-due-date',
    'Pregnancy Due Date Calculator',
    'due in days = 280 - days since last menstrual period',
    [input('daysSinceLmp', 'Days since LMP', 42, 'days', 0, 280)],
    ({ daysSinceLmp }) => success('Days until due date', 280 - daysSinceLmp, { gestationalWeeks: roundTo(daysSinceLmp / 7, 1) }),
  ),
  'protein-calculator': buildEngine(
    'protein-calculator',
    'Protein Calculator',
    'protein target = weight × activity factor',
    [input('weightKg', 'Weight', 80, 'kg', 1), input('factor', 'Protein factor', 1.6, 'g/kg', 0.8, 2.5)],
    ({ weightKg, factor }) => success('Daily protein', weightKg * factor),
  ),
  'pss10-stress': buildEngine(
    'pss10-stress',
    'PSS-10 Stress Scale',
    'PSS-10 total = scored survey sum',
    [input('score', 'PSS-10 score', 16, undefined, 0, 40)],
    ({ score }) => success('PSS-10 score', score, { severity: severity(score, [[13, 'Low'], [26, 'Moderate'], [40, 'High']]) }),
  ),
  'rent-vs-buy': buildEngine(
    'rent-vs-buy',
    'Rent vs Buy Calculator',
    'monthly ownership cost compared with rent',
    [input('monthlyRent', 'Monthly rent', 2200, '$', 0), input('homePrice', 'Home price', 450000, '$', 0), input('downPayment', 'Down payment', 90000, '$', 0), input('annualRate', 'Annual rate', 6, '%', 0)],
    ({ monthlyRent, homePrice, downPayment, annualRate }) => {
      const monthlyOwnership = amortizedPayment(Math.max(0, homePrice - downPayment), annualRate, 30);
      return success('Monthly difference', monthlyOwnership - monthlyRent, { monthlyOwnership: roundTo(monthlyOwnership, 2) });
    },
  ),
  'retirement-calculator': buildEngine(
    'retirement-calculator',
    'Retirement Calculator',
    'future savings = current savings compounded plus monthly contributions',
    [input('currentSavings', 'Current savings', 100000, '$', 0), input('monthlyContribution', 'Monthly contribution', 1000, '$', 0), input('annualReturn', 'Annual return', 6, '%', 0), input('years', 'Years', 25, 'years', 1)],
    ({ currentSavings, monthlyContribution, annualReturn, years }) => success('Projected savings', futureValue(currentSavings, monthlyContribution, annualReturn, years)),
  ),
  'roi-calculator': buildEngine(
    'roi-calculator',
    'ROI Calculator',
    'ROI = (return - cost) / cost × 100',
    [input('returnValue', 'Return value', 15000, '$', 0), input('cost', 'Cost', 10000, '$', 1)],
    ({ returnValue, cost }) => success('ROI', ((returnValue - cost) / cost) * 100),
  ),
  'rule-of-72': buildEngine(
    'rule-of-72',
    'Rule of 72 Calculator',
    'years to double = 72 / annual return',
    [input('annualRate', 'Annual rate', 8, '%', 0.1)],
    ({ annualRate }) => success('Years to double', 72 / annualRate),
  ),
  'running-pace': buildEngine(
    'running-pace',
    'Running Pace Calculator',
    'pace = total minutes / distance',
    [input('distanceKm', 'Distance', 10, 'km', 0.1), input('timeMinutes', 'Time', 55, 'minutes', 0.1)],
    ({ distanceKm, timeMinutes }) => success('Pace per km', timeMinutes / distanceKm),
  ),
  'savings-goal': buildEngine(
    'savings-goal',
    'Savings Goal Calculator',
    'months = (goal - current savings) / monthly saving',
    [input('goal', 'Goal', 20000, '$', 1), input('currentSavings', 'Current savings', 5000, '$', 0), input('monthlySaving', 'Monthly saving', 500, '$', 1)],
    ({ goal, currentSavings, monthlySaving }) => success('Months to goal', Math.max(0, Math.ceil((goal - currentSavings) / monthlySaving))),
  ),
  'side-income-tax': buildEngine(
    'side-income-tax',
    'Side Income Tax Calculator',
    'estimated tax = side income × tax rate',
    [input('sideIncome', 'Side income', 12000, '$', 0), input('taxRate', 'Tax rate', 25, '%', 0)],
    ({ sideIncome, taxRate }) => success('Estimated tax', sideIncome * taxRate / 100),
  ),
  'sip-calculator': buildEngine(
    'sip-calculator',
    'SIP Calculator',
    'future value of monthly investment contributions',
    [input('monthlyInvestment', 'Monthly investment', 500, '$', 0), input('annualReturn', 'Annual return', 10, '%', 0), input('years', 'Years', 15, 'years', 1)],
    ({ monthlyInvestment, annualReturn, years }) => success('Future value', futureValue(0, monthlyInvestment, annualReturn, years)),
  ),
  'sleep-calculator': buildEngine(
    'sleep-calculator',
    'Sleep Calculator',
    'bedtime = wake hour - cycles × 90 minutes - 15 minutes',
    [input('wakeHour', 'Wake hour', 7, undefined, 0, 23), input('cycles', 'Sleep cycles', 5, undefined, 1, 6)],
    ({ wakeHour, cycles }) => {
      const bedtime = (wakeHour * 60 - cycles * 90 - 15 + 1440) % 1440;
      return success('Recommended bedtime hour', bedtime / 60, { bedtimeMinutesAfterMidnight: roundTo(bedtime, 0) });
    },
  ),
  'smoke-free': buildEngine(
    'smoke-free',
    'Quit Smoking Calculator',
    'money saved = cigarettes avoided / pack size × pack price',
    [input('cigarettesPerDay', 'Cigarettes per day', 15, undefined, 0), input('packPrice', 'Pack price', 10, '$', 0), input('daysSmokeFree', 'Days smoke-free', 30, 'days', 0)],
    ({ cigarettesPerDay, packPrice, daysSmokeFree }) => success('Money saved', (cigarettesPerDay / 20) * packPrice * daysSmokeFree),
  ),
  'steps-to-calories': buildEngine(
    'steps-to-calories',
    'Steps to Calories Calculator',
    'calories = steps × weight × 0.0005',
    [input('steps', 'Steps', 10000, undefined, 0), input('weightKg', 'Weight', 70, 'kg', 1)],
    ({ steps, weightKg }) => success('Calories burned', steps * weightKg * 0.0005),
  ),
  'stock-average': buildEngine(
    'stock-average',
    'Stock Average Calculator',
    'average cost = total cost / total shares',
    [input('sharesOwned', 'Shares owned', 20, undefined, 0), input('averageCost', 'Average cost', 100, '$', 0), input('newShares', 'New shares', 10, undefined, 0), input('newPrice', 'New price', 80, '$', 0)],
    ({ sharesOwned, averageCost, newShares, newPrice }) => success('Average cost', ((sharesOwned * averageCost) + (newShares * newPrice)) / Math.max(1, sharesOwned + newShares)),
  ),
  'tdee-calculator': buildEngine(
    'tdee-calculator',
    'TDEE Calculator',
    'TDEE = BMR × activity multiplier',
    [input('weightKg', 'Weight', 70, 'kg', 1), input('heightCm', 'Height', 170, 'cm', 1), input('age', 'Age', 35, 'years', 1), input('activityMultiplier', 'Activity multiplier', 1.55, undefined, 1)],
    ({ weightKg, heightCm, age, activityMultiplier }, raw) => {
      const sexOffset = readText(raw, 'sex', 'male') === 'female' ? -161 : 5;
      const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + sexOffset;
      return success('TDEE', bmr * activityMultiplier, { bmr: roundTo(bmr, 0) });
    },
  ),
  'testosterone-calculator': buildEngine(
    'testosterone-calculator',
    'Testosterone Calculator',
    'free testosterone index = total testosterone / SHBG × 100',
    [input('totalTestosterone', 'Total testosterone', 600, 'ng/dL', 1), input('shbg', 'SHBG', 40, 'nmol/L', 1)],
    ({ totalTestosterone, shbg }) => success('Free androgen index', (totalTestosterone / shbg) * 100),
  ),
  'tip-calculator': buildEngine(
    'tip-calculator',
    'Tip Calculator',
    'tip = bill × tip percentage; split = total / people',
    [input('bill', 'Bill', 80, '$', 0), input('tipPercent', 'Tip percent', 18, '%', 0), input('people', 'People', 2, undefined, 1)],
    ({ bill, tipPercent, people }) => {
      const tip = bill * tipPercent / 100;
      return success('Total bill', bill + tip, { tip: roundTo(tip, 2), perPerson: roundTo((bill + tip) / people, 2) });
    },
  ),
  'vo2-max': buildEngine(
    'vo2-max',
    'VO2 Max Calculator',
    'VO2 max estimate = 15.3 × max heart rate / resting heart rate',
    [input('age', 'Age', 35, 'years', 1), input('restingHeartRate', 'Resting heart rate', 60, 'bpm', 1)],
    ({ age, restingHeartRate }) => success('VO2 max', (15.3 * (220 - age)) / restingHeartRate),
  ),
  'waist-hip-ratio': buildEngine(
    'waist-hip-ratio',
    'Waist-to-Hip Ratio Calculator',
    'WHR = waist circumference / hip circumference',
    [input('waistCm', 'Waist', 80, 'cm', 1), input('hipCm', 'Hip', 95, 'cm', 1)],
    ({ waistCm, hipCm }, raw) => {
      const ratio = waistCm / hipCm;
      const sex = readText(raw, 'sex', 'female');
      const risk = sex === 'male' ? (ratio > 0.9 ? 'Higher risk' : 'Lower risk') : (ratio > 0.85 ? 'Higher risk' : 'Lower risk');
      return success('Waist-to-hip ratio', ratio, { risk });
    },
  ),
  'water-intake': buildEngine(
    'water-intake',
    'Water Intake Calculator',
    'water target = weight × 35ml',
    [input('weightKg', 'Weight', 70, 'kg', 1)],
    ({ weightKg }) => success('Daily water', weightKg * 35, { liters: roundTo(weightKg * 35 / 1000, 2) }),
  ),
};

export function getCalculatorEngine(slug: CalculatorSlug) {
  return engines[slug];
}

export function calculateCalculator(slug: CalculatorSlug, inputs?: CalculatorInputs) {
  return getCalculatorEngine(slug).calculate(inputs);
}
