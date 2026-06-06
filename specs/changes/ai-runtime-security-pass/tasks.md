# Tasks: ai-runtime-security-pass

Production code pass. TDD required.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/ai-runtime-security-pass`.
- [x] 0.2 Read security audit H2, current AI route, AI helpers, plan gates,
  route tests, and AI workspace client behavior.
- [x] 0.3 Run CDC gate before implementation.

## 1. Spec Baseline

- [x] 1.1 Create proposal, requirements, design, and tasks.
- [x] 1.2 Commit spec baseline.

## 2. TDD Red

- [x] 2.1 Add failing tests for oversized body, malformed payload, source
  length, duplicate platform normalization, and preview burst limiting.
- [x] 2.2 Commit RED tests after confirming focused tests fail.

## 3. Implementation Green

- [ ] 3.1 Add AI request normalization helpers and limits.
- [ ] 3.2 Add preview runtime usage/rate guard.
- [ ] 3.3 Wire bounded body reading, normalization, and runtime guard into
  `POST /api/ai/repurpose`.
- [ ] 3.4 Run focused tests until green.
- [ ] 3.5 Commit implementation.

## 4. Verification And Ship

- [ ] 4.1 Run unit, focused route, focused E2E, lint, type-check, and build.
- [ ] 4.2 Run CDC gate and ship preview.
- [ ] 4.3 Append evidence ledger rows.
- [ ] 4.4 Commit task closure and push branch.
- [ ] 4.5 Compound learning decision: record `none` unless a repeatable process
  issue appears.
