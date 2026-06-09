# supabase-auth-staging-rehearsal Specs Overview

## Capabilities

- `supabase-auth-staging-rehearsal`: real Supabase password login plus
  env-gated staging rehearsal for the protected AI app.

## Release Gate

This change does not claim production readiness unless the staging rehearsal is
run with real credentials:

- `TOOLARS_RUN_STAGING_AUTH_REHEARSAL=true`
- `TOOLARS_STAGING_BASE_URL`
- `TOOLARS_STAGING_TEST_EMAIL`
- `TOOLARS_STAGING_TEST_PASSWORD`

Without those values, local verification only proves the harness and login code
are ready.

## Verification Anchors

- `site/components/auth/__tests__/sign-in-form.test.tsx`
- `site/e2e/staging-auth-rehearsal.spec.ts`
- `site/playwright.config.ts`
- `docs/qa/SUPABASE-AUTH-STAGING-REHEARSAL.md`
