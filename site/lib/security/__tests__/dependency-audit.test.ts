import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const patchedPostcssVersion = '8.5.10';
const advisoryId = 'GHSA-qx2v-qp2m-jg93';

function compareVersions(left: string, right: string) {
  const leftParts = left.split('.').map(Number);
  const rightParts = right.split('.').map(Number);

  for (let index = 0; index < 3; index += 1) {
    const leftValue = leftParts[index] ?? 0;
    const rightValue = rightParts[index] ?? 0;
    if (leftValue !== rightValue) return leftValue - rightValue;
  }

  return 0;
}

function postcssVersionsFromLockfile(lockfile: string) {
  return [...lockfile.matchAll(/^\s{2}postcss@(\d+\.\d+\.\d+):/gm)].map(
    (match) => match[1],
  );
}

describe('dependency audit guard', () => {
  it('keeps PostCSS lockfile entries patched for GHSA-qx2v-qp2m-jg93', () => {
    const lockfile = readFileSync(join(process.cwd(), 'pnpm-lock.yaml'), 'utf8');
    const vulnerableVersions = postcssVersionsFromLockfile(lockfile).filter(
      (version) => compareVersions(version, patchedPostcssVersion) < 0,
    );

    expect(
      vulnerableVersions,
      `${advisoryId}: PostCSS lockfile entries must be >= ${patchedPostcssVersion}`,
    ).toEqual([]);
  });
});
