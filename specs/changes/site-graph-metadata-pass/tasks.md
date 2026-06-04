# Tasks: site-graph-metadata-pass

Execute in dependency order. Each implementation task should land with evidence.

## 0. Preparation
- [x] 0.1 Create feature branch `feat/site-graph-metadata-pass`.
- [x] 0.2 Read `.cdc/CONTEXT.md`, `.cdc/ARCHITECTURE.md`, and current SEO helpers.

## 1. Spec Baseline
- [x] 1.1 Create proposal, requirements, design, and tasks.
- [x] 1.2 Commit the spec baseline.

## 2. Red Phase
- [x] 2.1 Add unit tests for `Organization` and `WebSite` JSON-LD helpers.
  - Files: `site/lib/seo/__tests__/metadata.test.ts`
  - Covers: R2-S1, R2-S2
- [x] 2.2 Add E2E assertions for root Open Graph, Twitter card, and site-level JSON-LD.
  - Files: `site/e2e/seo.spec.ts`
  - Covers: R1-S1, R2-S1, R2-S2
- [x] 2.3 Run focused tests and record the expected failing result.

## 3. Green Phase
- [x] 3.1 Implement site graph schema helpers in `site/lib/seo/index.ts`.
- [x] 3.2 Implement root metadata and JSON-LD rendering in `site/app/layout.tsx`.
- [x] 3.3 Run focused tests and confirm green.
- [x] 3.4 Commit tests and implementation.

## 4. Verification And Ship
- [ ] 4.1 Run lint, type-check, unit tests, E2E, and build.
- [ ] 4.2 Run CDC gate and ship preview.
- [ ] 4.3 Run browser smoke on `http://127.0.0.1:9088/`.
- [ ] 4.4 Commit task closure and push branch.
- [ ] 4.5 Compound learning decision: record `none` unless a repeatable process issue appears.
