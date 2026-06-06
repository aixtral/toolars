import { describe, expect, it } from 'vitest';
import { APPROVED_CALCULATOR_SLUGS, CALCULATOR_TOOLS } from '@/data/calculators';
import {
  CALCULATOR_ENGINE_SLUGS,
  calculateCalculator,
  getCalculatorEngine,
} from '@/lib/calculators';
import {
  CALCULATOR_GOLDEN_CASES,
  CALCULATOR_QUALITY_PROFILES,
  HIGH_RISK_CALCULATOR_SLUGS,
  getCalculatorQualityProfile,
  getGoldenCasesForCalculator,
} from '@/lib/calculators/quality';
import { formatCurrency, formatNumber, roundTo } from '@/lib/formatting';

describe('calculator engine registry', () => {
  it('provides a pure calculation engine for all 73 calculator slugs', () => {
    expect(CALCULATOR_ENGINE_SLUGS).toHaveLength(73);
    expect(CALCULATOR_ENGINE_SLUGS).toEqual(APPROVED_CALCULATOR_SLUGS);

    for (const slug of APPROVED_CALCULATOR_SLUGS) {
      const engine = getCalculatorEngine(slug);
      expect(engine.slug).toBe(slug);
      expect(engine.inputs.length).toBeGreaterThan(0);
      expect(engine.formulaLabel.length).toBeGreaterThan(8);
    }
  });

  it('marks the migrated calculator inventory as formula-ported', () => {
    expect(CALCULATOR_TOOLS.every((tool) => tool.formulaStatus === 'ported')).toBe(
      true,
    );
  });

  it('calculates BMI using the migrated VitalCalc formula and categories', () => {
    const result = calculateCalculator('bmi-calculator', {
      heightCm: 170,
      weightKg: 66,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.primaryLabel).toBe('BMI');
    expect(result.primaryValue).toBe(22.8);
    expect(result.values.category).toBe('Normal');
  });

  it('calculates compound interest with monthly contributions', () => {
    const result = calculateCalculator('compound-interest', {
      principal: 1000,
      monthlyContribution: 100,
      annualRate: 12,
      years: 1,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.primaryLabel).toBe('Future value');
    expect(result.primaryValue).toBeCloseTo(2395.08, 2);
    expect(result.values.totalContributions).toBe(1200);
    expect(result.values.interest).toBeCloseTo(195.08, 2);
  });

  it('calculates mortgage payment and total interest', () => {
    const result = calculateCalculator('mortgage-calculator', {
      loanAmount: 300000,
      annualRate: 6,
      years: 30,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.primaryLabel).toBe('Monthly payment');
    expect(result.primaryValue).toBeCloseTo(1798.65, 2);
    expect(result.values.totalInterest).toBeCloseTo(347514.57, 2);
  });

  it('returns specific validation errors without producing misleading results', () => {
    const result = calculateCalculator('bmi-calculator', {
      heightCm: 0,
      weightKg: -20,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.errors).toEqual([
      { field: 'heightCm', message: 'Height must be greater than 0.' },
      { field: 'weightKg', message: 'Weight must be greater than 0.' },
    ]);
  });

  it('classifies formula risk for every approved calculator slug', () => {
    const profileSlugs = CALCULATOR_QUALITY_PROFILES.map((profile) => profile.slug);

    expect(profileSlugs).toHaveLength(APPROVED_CALCULATOR_SLUGS.length);
    expect(new Set(profileSlugs)).toEqual(new Set(APPROVED_CALCULATOR_SLUGS));

    for (const slug of APPROVED_CALCULATOR_SLUGS) {
      const profile = getCalculatorQualityProfile(slug);
      expect(profile.slug).toBe(slug);
      expect(['high', 'medium', 'low']).toContain(profile.riskLevel);
      expect(['health', 'finance', 'utility']).toContain(profile.domain);
      expect(profile.rationale.length).toBeGreaterThan(12);
    }
  });

  it('keeps at least two source-backed golden cases for every high-risk calculator in this pass', () => {
    expect(HIGH_RISK_CALCULATOR_SLUGS.length).toBeGreaterThan(8);

    for (const slug of HIGH_RISK_CALCULATOR_SLUGS) {
      const cases = getGoldenCasesForCalculator(slug);
      expect(cases.length, `${slug} golden cases`).toBeGreaterThanOrEqual(2);

      for (const goldenCase of cases) {
        expect(goldenCase.source.name.length).toBeGreaterThan(2);
        expect(goldenCase.source.url).toMatch(/^https:\/\//);
        expect(goldenCase.source.note.length).toBeGreaterThan(10);
      }
    }

    expect(CALCULATOR_GOLDEN_CASES.length).toBeGreaterThanOrEqual(
      HIGH_RISK_CALCULATOR_SLUGS.length * 2,
    );
  });

  it('matches source-backed golden fixture outputs for high-risk calculators', () => {
    for (const goldenCase of CALCULATOR_GOLDEN_CASES) {
      const result = calculateCalculator(goldenCase.slug, goldenCase.inputs);

      expect(result.ok, goldenCase.name).toBe(true);
      if (!result.ok) continue;

      if (goldenCase.expected.primaryLabel) {
        expect(result.primaryLabel).toBe(goldenCase.expected.primaryLabel);
      }

      expect(result.primaryValue).toBeCloseTo(
        goldenCase.expected.primaryValue,
        goldenCase.expected.precision ?? 2,
      );

      for (const [key, expectedValue] of Object.entries(
        goldenCase.expected.values ?? {},
      )) {
        const actualValue = result.values[key];
        if (typeof expectedValue === 'number') {
          expect(actualValue).toBeCloseTo(expectedValue, goldenCase.expected.precision ?? 2);
        } else {
          expect(actualValue).toBe(expectedValue);
        }
      }
    }
  });

  it('uses source-backed BMI and blood pressure category boundaries', () => {
    const normalBmi = calculateCalculator('bmi-calculator', {
      heightCm: 170,
      weightKg: 72,
    });
    expect(normalBmi.ok).toBe(true);
    if (normalBmi.ok) {
      expect(normalBmi.primaryValue).toBe(24.9);
      expect(normalBmi.values.category).toBe('Normal');
    }

    const overweightBmi = calculateCalculator('bmi-calculator', {
      heightCm: 170,
      weightKg: 85,
    });
    expect(overweightBmi.ok).toBe(true);
    if (overweightBmi.ok) {
      expect(overweightBmi.primaryValue).toBe(29.4);
      expect(overweightBmi.values.category).toBe('Overweight');
    }

    const stageOneBloodPressure = calculateCalculator('blood-pressure', {
      systolic: 130,
      diastolic: 80,
    });
    expect(stageOneBloodPressure.ok).toBe(true);
    if (stageOneBloodPressure.ok) {
      expect(stageOneBloodPressure.values.category).toBe('Stage 1 hypertension');
    }
  });

  it('rejects debt payoff inputs that cannot cover first-month interest', () => {
    const result = calculateCalculator('debt-payoff', {
      balance: 10000,
      annualRate: 18,
      monthlyPayment: 100,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.errors).toContainEqual({
      field: 'monthlyPayment',
      message: 'Monthly payment must exceed first-month interest.',
    });
  });
});

describe('number formatting helpers', () => {
  it('formats calculator numbers consistently for UI and exports', () => {
    expect(roundTo(2395.0842, 2)).toBe(2395.08);
    expect(formatNumber(12345.678, 1)).toBe('12,345.7');
    expect(formatCurrency(1798.65)).toBe('$1,798.65');
  });
});
