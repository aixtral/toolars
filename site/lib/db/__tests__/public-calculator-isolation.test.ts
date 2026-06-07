import { describe, expect, it } from 'vitest';
import { findForbiddenPublicCalculatorImports } from '@/lib/db/public-calculator-isolation';

describe('public calculator dependency isolation', () => {
  it('keeps public calculator paths free of account, billing, database, and AI runtime imports', () => {
    expect(findForbiddenPublicCalculatorImports()).toEqual([]);
  });
});
