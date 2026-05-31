import { beforeEach, describe, expect, it } from 'vitest';
import {
  addCalculatorComparison,
  readCalculatorComparisons,
  readSavedCalculatorResults,
  saveCalculatorResult,
} from '@/lib/storage';

const result = {
  slug: 'bmi-calculator',
  title: 'BMI Calculator',
  primaryLabel: 'BMI',
  primaryValue: 23.15,
  values: { category: 'Normal' },
};

describe('calculator local storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores anonymous saved results with newest items first', () => {
    const saved = saveCalculatorResult(result);

    expect(saved).toMatchObject(result);
    expect(saved.id).toMatch(/^bmi-calculator-/);
    expect(readSavedCalculatorResults()).toEqual([saved]);
  });

  it('stores local calculator comparisons separately from saved results', () => {
    const comparison = addCalculatorComparison(result);

    expect(readSavedCalculatorResults()).toEqual([]);
    expect(readCalculatorComparisons()).toEqual([comparison]);
  });
});
