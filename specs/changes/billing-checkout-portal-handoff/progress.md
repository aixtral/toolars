# Progress: billing-checkout-portal-handoff

## 2026-06-09 22:14 - Spec Created

- Completed: created branch `feat/billing-checkout-portal-handoff`.
- Completed: scoped the change to configured checkout URLs and subscription
  portal handoff, not outbound Lemon Squeezy API checkout creation.
- Completed: verified Lemon Squeezy official docs for checkout custom data,
  prefill query params, and customer portal URL behavior.
- Next session start: continue with task 2.1 RED tests in
  `site/lib/billing/__tests__/handoff.test.ts`.

## 2026-06-09 22:16 - Handoff Helpers

- Completed: RED test for missing `site/lib/billing/handoff.ts` module.
- Completed: implemented env config parsing, HTTPS-only URL validation, and
  checkout URL decoration with workspace/user/email/return path.
- Evidence: `pnpm --dir site test -- handoff` passed with 49 files and 173
  tests.
- Next session start: continue with task 2.3 repository lookup RED tests.

## 2026-06-09 22:18 - Workspace Subscription Lookup

- Completed: RED tests for `getSubscriptionForWorkspace()` failed on missing
  repository method.
- Completed: added workspace subscription lookup to in-memory and Supabase
  billing repositories.
- Evidence: `pnpm --dir site test -- billing supabase` passed with 49 files and
  175 tests.
- Next session start: continue with task 3.1 route RED tests.

## 2026-06-09 22:20 - Checkout And Portal Routes

- Completed: RED tests for missing `/api/billing/checkout` and
  `/api/billing/portal` route handlers.
- Completed: checkout route with session requirement, paid-plan validation,
  configured provider URL lookup, checkout URL decoration, and `303` redirect.
- Completed: portal route with session requirement, signed subscription portal
  lookup, unsigned portal fallback, and fail-closed `404`.
- Evidence: `pnpm --dir site test -- checkout portal` passed with 51 files and
  181 tests.
- Next session start: continue with task 4.1 billing UI RED tests.

## 2026-06-09 22:22 - Billing UI Hooks

- Completed: RED tests for checkout form and manage billing link failed on
  missing UI wiring.
- Completed: `UpgradePrompt` now posts `planId=pro` to
  `/api/billing/checkout`; `UsagePlanCard` exposes `/api/billing/portal` for
  paid plans.
- Completed: checkout route now accepts both JSON and form-encoded submissions.
- Evidence: `pnpm --dir site test -- checkout billing.test.tsx` passed with 51
  files and 182 tests.
- Next session start: run focused and standard verification.
