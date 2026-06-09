# Tasks: supabase-auth-staging-rehearsal

Follow tasks in dependency order. Production code tasks must use TDD Red →
Green before implementation.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/supabase-auth-staging-rehearsal`.
- [x] 0.2 Add this CDC spec package.
  - Files: `specs/changes/supabase-auth-staging-rehearsal/**`
  - Verification: `test -f specs/changes/supabase-auth-staging-rehearsal/design.md`

## 1. Login Implementation

- [x] 1.1 Add failing tests for login redirect and error behavior.
  - Files: `site/components/auth/__tests__/sign-in-form.test.tsx`
  - Covers: R1-S1, R1-S2, R1-S3
  - Verification: `pnpm --dir site test -- sign-in-form`
- [x] 1.2 Implement Supabase password sign-in form and safe next path handling.
  - Files: `site/components/auth/sign-in-form.tsx`,
    `site/components/auth/index.ts`, `site/app/login/page.tsx`
  - Covers: R1-S1, R1-S2, R1-S3
- [x] 1.3 Run Green login tests and commit.
  - Verification: `pnpm --dir site test -- sign-in-form`
  - Commit: `feat(auth): add Supabase sign-in form (task 1.3)`

## 2. Staging Rehearsal Harness

- [x] 2.1 Add failing/skipped Playwright staging rehearsal spec.
  - Files: `site/e2e/staging-auth-rehearsal.spec.ts`,
    `site/playwright.config.ts`
  - Covers: R2-S1, R2-S2, R2-S3
  - Verification: `pnpm --dir site exec playwright test e2e/staging-auth-rehearsal.spec.ts --reporter=line`
- [x] 2.2 Implement env-gated staging Playwright config and rehearsal flow.
  - Files: `site/e2e/staging-auth-rehearsal.spec.ts`,
    `site/playwright.config.ts`
  - Covers: R2-S1, R2-S2, R2-S3
- [x] 2.3 Run local skipped rehearsal and commit.
  - Verification: `pnpm --dir site exec playwright test e2e/staging-auth-rehearsal.spec.ts --reporter=line`
  - Commit: `test(e2e): add Supabase auth staging rehearsal (task 2.3)`

## 3. Documentation And Verification

- [x] 3.1 Document staging env vars, command, expected evidence, and no-false-pass rule.
  - File: `docs/qa/SUPABASE-AUTH-STAGING-REHEARSAL.md`
- [x] 3.2 Verify calculator isolation still holds.
  - Verification: `if rg -n "from '@/lib/(auth|billing|usage|supabase|ai|plans)'|from \"@/lib/(auth|billing|usage|supabase|ai|plans)\"" site/app/tools site/lib/calculators site/components/tools site/components/calculators; then echo 'forbidden imports found'; exit 1; else echo 'ok: no forbidden calculator imports'; fi`
  - Covers: R3-S1
- [x] 3.3 Run branch verification.
  - Verification: `pnpm --dir site lint`, `pnpm --dir site type-check`,
    `pnpm --dir site test`, `pnpm --dir site build`,
    `pnpm --dir site test:e2e`, `cdc-workflow gate --mode standard --root .`
- [x] 3.4 Record CDC evidence, ship preview, push, and create draft PR.
  - Verification: `cdc-workflow ship-preview --change supabase-auth-staging-rehearsal --root .`
