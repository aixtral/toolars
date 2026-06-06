# Tasks: security-event-logging-pass

Production code pass. TDD required.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/security-event-logging-pass`.
- [x] 0.2 Read M3 audit finding and current AI/billing route failure paths.
- [x] 0.3 Run CDC context gate.

## 1. Spec Baseline

- [x] 1.1 Create proposal, requirements, design, and tasks.
- [x] 1.2 Commit spec baseline.

## 2. TDD Red

- [x] 2.1 Add failing security event recorder tests for request IDs,
  allowlisted metadata, and sensitive-value omission.
  - covers: R3-S1, R3-S2
- [x] 2.2 Add failing AI route tests for auth failure and plan denial events.
  - covers: R1-S1, R1-S2
- [x] 2.3 Add failing billing route tests for invalid signature and unsupported
  payload events.
  - covers: R2-S1, R2-S2
- [x] 2.4 Commit RED tests after confirming focused tests fail.

## 3. Implementation Green

- [ ] 3.1 Add `site/lib/security/events.ts`.
- [ ] 3.2 Wire AI route failure paths to `recordSecurityEvent`.
- [ ] 3.3 Wire billing route failure paths to `recordSecurityEvent`.
- [ ] 3.4 Run focused tests until green.
- [ ] 3.5 Commit implementation.

## 4. Verification And Ship

- [ ] 4.1 Run focused security/AI/billing tests.
- [ ] 4.2 Run lint, type-check, full unit tests, E2E, and build.
- [ ] 4.3 Run security grep proving sensitive sentinel values are test-only.
- [ ] 4.4 Run CDC gate and ship preview.
- [ ] 4.5 Append evidence ledger rows.
- [ ] 4.6 Commit task closure, push branch, and create draft PR.
- [ ] 4.7 Compound learning decision: record `none` unless a repeatable process
  issue appears.
