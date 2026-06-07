import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { findForbiddenPublicCalculatorImports } from '@/lib/db/public-calculator-isolation';

describe('public calculator dependency isolation', () => {
  it('keeps public calculator paths free of account, billing, database, and AI runtime imports', () => {
    expect(findForbiddenPublicCalculatorImports()).toEqual([]);
  });

  it('detects usage-metering imports in public calculator paths', () => {
    const root = mkdtempSync(join(tmpdir(), 'toolars-public-isolation-'));
    const toolsDir = join(root, 'app/tools');

    mkdirSync(toolsDir, { recursive: true });
    writeFileSync(
      join(toolsDir, 'page.tsx'),
      "import { createMonthlyUsagePeriod } from '@/lib/usage';\n",
    );

    try {
      expect(findForbiddenPublicCalculatorImports(root)).toMatchObject([
        {
          file: 'app/tools/page.tsx',
          module: '@/lib/usage',
          line: 1,
        },
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
