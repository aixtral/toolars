import { describe, expect, it } from 'vitest';
import { APPROVED_CALCULATOR_SLUGS, CALCULATOR_TOOLS } from '@/data/calculators';
import {
  CALCULATOR_ENGINE_SLUGS,
  calculateCalculator,
  getCalculatorEngine,
} from '@/lib/calculators';
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
      {
        field: 'heightCm',
        message: 'Height must be greater than 0.',
        code: 'greaterThan',
        label: 'Height',
        bound: 0,
      },
      {
        field: 'weightKg',
        message: 'Weight must be greater than 0.',
        code: 'greaterThan',
        label: 'Weight',
        bound: 0,
      },
    ]);
  });
});

describe('number formatting helpers', () => {
  it('formats calculator numbers consistently for UI and exports', () => {
    expect(roundTo(2395.0842, 2)).toBe(2395.08);
    expect(formatNumber(12345.678, 1)).toBe('12,345.7');
    expect(formatCurrency(1798.65)).toBe('$1,798.65');
  });
});
