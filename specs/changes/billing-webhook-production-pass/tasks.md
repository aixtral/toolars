# Tasks: billing-webhook-production-pass

Production code pass. TDD required.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/billing-webhook-production-pass`.
- [x] 0.2 Bring `docs/architecture/BILLING-SUBSCRIPTION-STATE-DESIGN.md` into
  the current security stack.
- [x] 0.3 Verify CDC context gate.

## 1. Spec Baseline

- [x] 1.1 Create proposal, requirements, design, and tasks for this runtime
  implementation pass.
- [x] 1.2 Commit spec baseline.

## 2. TDD Red

- [ ] 2.1 Add failing billing library tests for Lemon signature verification,
  provider payload parsing, status access mapping, unknown variants, and
  idempotent duplicate processing.
  - covers: R1-S1, R2-S1, R2-S2, R3-S1, R4-S1, R4-S2
- [ ] 2.2 Add failing route tests for `X-Signature`, old preview headers,
  duplicate delivery, and unknown variant responses.
  - covers: R1-S1, R1-S2, R3-S1
- [ ] 2.3 Commit RED tests after confirming focused billing tests fail.

## 3. Implementation Green

- [ ] 3.1 Replace preview billing signature helpers with Lemon raw-body
  signature helpers while preserving timing-safe comparison.
  - files: `site/lib/billing/index.ts`
- [ ] 3.2 Add provider event parser, variant mapping, access mapper, and
  processor/service functions.
  - files: `site/lib/billing/index.ts`
- [ ] 3.3 Add server-only in-memory billing repository and test reset helpers.
  - files: `site/lib/billing/index.ts`
- [ ] 3.4 Update `/api/billing/webhook` to require `X-Signature` and
  `X-Event-Name`, process events idempotently, and return structured responses.
  - files: `site/app/api/billing/webhook/route.ts`
- [ ] 3.5 Run focused tests until green.
- [ ] 3.6 Commit implementation.

## 4. Verification And Ship

- [ ] 4.1 Run `pnpm --dir site test -- billing`.
- [ ] 4.2 Run `pnpm --dir site test:e2e -- auth-billing`.
- [ ] 4.3 Run lint, type-check, full unit tests, and build.
- [ ] 4.4 Run CDC gate and ship preview.
- [ ] 4.5 Append evidence ledger rows.
- [ ] 4.6 Commit task closure, push branch, and create draft PR.
- [ ] 4.7 Compound learning decision: record `none` unless a repeatable process
  issue appears.
