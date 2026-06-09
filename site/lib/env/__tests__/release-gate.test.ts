import { describe, expect, it } from 'vitest';
import {
  assertToolarsProductionEnv,
  isPreviewAuthAllowed,
  validateToolarsProductionEnv,
} from '@/lib/env/release-gate';

describe('production env release gate', () => {
  it('fails production env when preview auth is enabled', () => {
    const env = {
      NODE_ENV: 'production',
      TOOLARS_ENABLE_PREVIEW_AUTH: 'true',
    };

    expect(validateToolarsProductionEnv(env)).toEqual([
      'TOOLARS_ENABLE_PREVIEW_AUTH must not be true when NODE_ENV=production.',
    ]);
    expect(() => assertToolarsProductionEnv(env)).toThrow(
      'TOOLARS_ENABLE_PREVIEW_AUTH must not be true when NODE_ENV=production.',
    );
  });

  it('allows local preview auth by default', () => {
    expect(isPreviewAuthAllowed({ NODE_ENV: 'development' })).toBe(true);
    expect(isPreviewAuthAllowed({ NODE_ENV: 'test' })).toBe(true);
  });

  it('allows non-production preview auth to be explicitly disabled', () => {
    expect(
      isPreviewAuthAllowed({
        NODE_ENV: 'development',
        TOOLARS_ENABLE_PREVIEW_AUTH: 'false',
      }),
    ).toBe(false);
  });

  it('never allows preview auth in production', () => {
    expect(
      isPreviewAuthAllowed({
        NODE_ENV: 'production',
        TOOLARS_ENABLE_PREVIEW_AUTH: 'true',
      }),
    ).toBe(false);
  });
});
