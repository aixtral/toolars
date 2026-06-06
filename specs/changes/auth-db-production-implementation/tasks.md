# Tasks: auth-db-production-implementation

Production code pass. TDD required for implementation tasks.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/auth-db-production-implementation`.
- [x] 0.2 Read CDC context, architecture, current iteration plan, security
  audit anchors, current preview auth, AI route, and billing boundaries.
- [x] 0.3 Commit spec baseline.

## 1. Supabase Runtime Foundation

- [x] 1.1 Add failing tests for Supabase public/service env parsing and
  browser-safe public config.
  - Files: `site/lib/supabase/__tests__/env.test.ts`
  - Covers: R1-S1, R1-S2
- [x] 1.2 Install Supabase SDK packages and implement env/client/service helper
  modules.
  - Files: `site/package.json`, `site/pnpm-lock.yaml`,
    `site/lib/supabase/env.ts`, `site/lib/supabase/client.ts`,
    `site/lib/supabase/server.ts`, `site/lib/supabase/service.ts`
  - Covers: R1-S1, R1-S2
- [x] 1.3 Run focused Supabase env tests and commit GREEN.

## 2. Session Facade

- [x] 2.1 Add failing tests for Supabase user-to-session mapping, missing
  workspace denial, and production preview denial.
  - Files: `site/lib/auth/__tests__/supabase-session.test.ts`,
    `site/lib/auth/__tests__/auth.test.ts`
  - Covers: R2-S1, R2-S2, R2-S3
- [x] 2.2 Implement production session resolver and make route-handler session
  lookup async.
  - Files: `site/lib/auth/index.ts`,
    `site/lib/auth/supabase-session.ts`,
    `site/app/api/ai/repurpose/route.ts`,
    `site/app/api/ai/repurpose/route.test.ts`
  - Covers: R2-S1, R2-S2, R2-S3
- [x] 2.3 Run focused auth/AI tests and commit GREEN.

## 3. Account Workspace Migration

- [x] 3.1 Add failing static migration tests for account tables, trigger, RLS,
  and policies.
  - Files: `site/lib/db/__tests__/account-migration.test.ts`
  - Covers: R3-S1, R3-S2
- [x] 3.2 Add Supabase migration for `profiles`, `workspaces`, and
  `workspace_members`.
  - Files:
    `supabase/migrations/20260606152000_auth_workspace_foundation.sql`
  - Covers: R3-S1, R3-S2
- [x] 3.3 Run focused migration tests and commit GREEN.

## 4. Public Calculator Isolation

- [x] 4.1 Add failing dependency isolation test for public calculator paths.
  - Files: `site/lib/db/__tests__/public-calculator-isolation.test.ts`
  - Covers: R4-S1
- [x] 4.2 Fix any forbidden imports found by the isolation test.
  - Files: only public calculator/search/registry files if needed
  - Covers: R4-S1
- [x] 4.3 Run focused isolation tests and commit GREEN.

## 5. Verification And Ship

- [x] 5.1 Run focused auth/supabase/db/AI tests.
- [x] 5.2 Run `pnpm --dir site lint`, `pnpm --dir site type-check`, and
  `pnpm --dir site test`.
- [x] 5.3 Run `pnpm --dir site build`; restore `site/next-env.d.ts` if Next
  build rewrites it.
- [x] 5.4 Run `pnpm --dir site test:e2e -- auth-billing` with a dev server on
  port 9088.
- [x] 5.5 Run CDC gate and ship preview.
- [x] 5.6 Append evidence ledger rows.
- [x] 5.7 Commit task closure, push branch, and create draft PR stacked on
  `feat/security-event-logging-pass`.
- [x] 5.8 Compound learning decision: record `none` unless a repeatable process
  issue appears.
