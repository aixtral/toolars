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
