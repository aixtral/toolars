# Tasks: auth-session-cookie-handoff

Follow tasks in dependency order. Production code tasks must use TDD Red →
Green before implementation.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/auth-session-cookie-handoff`.
- [x] 0.2 Add this CDC spec package.
  - Files: `specs/changes/auth-session-cookie-handoff/**`
  - Verification: `test -f specs/changes/auth-session-cookie-handoff/design.md`

## 1. Supabase Session Runtime

- [x] 1.1 Add failing tests for server request session resolution.
  - Files: `site/lib/auth/__tests__/auth.test.ts`,
    `site/lib/auth/__tests__/supabase-session.test.ts`
  - Covers: R1-S1, R1-S2, R1-S3, R3-S1, R3-S2
  - Verification: `pnpm --dir site test -- auth supabase-session`
- [x] 1.2 Implement Supabase cookie-backed session resolution.
  - Files: `site/lib/auth/index.ts`, `site/lib/auth/supabase-session.ts`,
    `site/lib/supabase/server.ts`
  - Key points: use verified `auth.getUser()`, service-side membership lookup,
    production fail-closed behavior, injectable test seams.
  - Covers: R1-S1, R1-S2, R1-S3, R3-S1, R3-S2
- [x] 1.3 Run Green tests and commit.
  - Verification: `pnpm --dir site test -- auth supabase-session`
  - Commit: `feat(auth): wire Supabase cookie session handoff (task 1.3)`

## 2. App Proxy Guard

- [x] 2.1 Add failing tests for Supabase-cookie app route access.
  - File: `site/proxy.test.ts`
  - Covers: R2-S1, R2-S2, R3-S3
  - Verification: `pnpm --dir site test -- proxy`
- [x] 2.2 Implement Supabase-aware `/app/**` proxy guard.
  - File: `site/proxy.ts`
  - Key points: allow verified Supabase cookie sessions, write refreshed
    cookies/headers to response, preserve login redirect `next`.
  - Covers: R2-S1, R2-S2, R3-S3
- [x] 2.3 Run Green proxy tests and commit.
  - Verification: `pnpm --dir site test -- proxy`
  - Commit: `feat(auth): guard app routes with Supabase cookies (task 2.3)`

## 3. AI API Integration

- [x] 3.1 Add failing tests for AI route production session injection.
  - File: `site/app/api/ai/repurpose/route.test.ts`
  - Covers: R1-S1, R1-S2, R1-S3
  - Verification: `pnpm --dir site test -- repurpose`
- [x] 3.2 Wire AI route handler to injectable session resolver.
  - File: `site/app/api/ai/repurpose/route.ts`
  - Key points: keep preview tests working, do not increment usage on denied
    auth, do not trust preview headers in production.
  - Covers: R1-S1, R1-S2, R1-S3
- [x] 3.3 Run Green API tests and commit.
  - Verification: `pnpm --dir site test -- repurpose`
  - Commit: `feat(auth): use Supabase sessions in AI route (task 3.3)`

## 4. Verification And Release Evidence

- [ ] 4.1 Verify calculator isolation still holds.
  - Verification: `rg -n "from '@/lib/(auth|billing|usage|supabase|ai|plans)'|from \"@/lib/(auth|billing|usage|supabase|ai|plans)\"" site/app/tools site/lib/calculators site/components/tools site/components/calculators`
  - Covers: R4-S1
- [ ] 4.2 Run branch verification.
  - Verification: `pnpm --dir site lint`, `pnpm --dir site type-check`,
    `pnpm --dir site test`, `pnpm --dir site build`,
    `pnpm --dir site test:e2e`, `cdc-workflow gate --mode standard --root .`
- [ ] 4.3 Update audit/status docs and CDC evidence.
  - Files: `docs/security/FINAL-PRODUCTION-SECURITY-AUDIT.md`,
    `.cdc/state/evidence.jsonl`, `.cdc/state/closeouts.jsonl`
- [ ] 4.4 Run ship preview, push, and create draft PR.
  - Verification: `cdc-workflow ship-preview --change auth-session-cookie-handoff --root .`
