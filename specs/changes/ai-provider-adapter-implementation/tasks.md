# Tasks: ai-provider-adapter-implementation

Production code pass. TDD required for implementation tasks.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/ai-provider-adapter-implementation`.
- [x] 0.2 Read CDC context, current AI implementation, previous design pass,
  and official AI SDK/Vercel docs.
- [x] 0.3 Commit spec baseline.

## 1. Provider Contract And Preview Service

- [ ] 1.1 Add failing tests for provider contract, deterministic preview
  provider, usage metadata, and service output mapping.
  - Files: `site/lib/ai/__tests__/provider.test.ts`
  - Covers: R1-S1, R1-S2, R3-S1
- [ ] 1.2 Implement provider types, preview provider, and service orchestration.
  - Files: `site/lib/ai/provider.ts`, `site/lib/ai/service.ts`,
    `site/lib/ai/providers/preview.ts`, `site/lib/ai/index.ts`
  - Covers: R1-S1, R1-S2, R3-S1
- [ ] 1.3 Run focused provider tests and commit GREEN.

## 2. AI SDK Adapter And Config

- [ ] 2.1 Add failing tests for AI SDK fake executor, provider config, and
  normalized provider errors.
  - Files: `site/lib/ai/__tests__/ai-sdk-provider.test.ts`,
    `site/lib/ai/__tests__/provider-config.test.ts`
  - Covers: R2-S1, R3-S2, R4-S1, R4-S2
- [ ] 2.2 Install `ai` package and implement server-only AI SDK adapter.
  - Files: `site/package.json`, `site/pnpm-lock.yaml`,
    `site/lib/ai/provider-config.ts`, `site/lib/ai/providers/ai-sdk.ts`
  - Covers: R2-S1, R3-S2, R4-S1, R4-S2
- [ ] 2.3 Run focused AI SDK/config tests and commit GREEN.

## 3. Route Integration And Boundaries

- [ ] 3.1 Add failing tests proving the route returns provider metadata and
  provider SDK imports stay server-only.
  - Files: `site/app/api/ai/repurpose/route.test.ts`,
    `site/lib/ai/__tests__/provider-boundary.test.ts`
  - Covers: R1-S1, R2-S2, R3-S1
- [ ] 3.2 Update route to call provider-neutral service and add import-boundary
  scanner.
  - Files: `site/app/api/ai/repurpose/route.ts`,
    `site/lib/ai/provider-boundary.ts`
  - Covers: R1-S1, R2-S2, R3-S1
- [ ] 3.3 Run focused route/boundary tests and commit GREEN.

## 4. Verification And Ship

- [ ] 4.1 Run focused AI/provider/route tests.
- [ ] 4.2 Run `pnpm --dir site lint`, `pnpm --dir site type-check`, and
  `pnpm --dir site test`.
- [ ] 4.3 Run `pnpm --dir site build`; restore `site/next-env.d.ts` if Next
  build rewrites it.
- [ ] 4.4 Run `pnpm --dir site test:e2e -- ai-repurpose auth-billing` with a
  dev server on port 9088.
- [ ] 4.5 Run provider secret/import grep checks.
- [ ] 4.6 Run CDC gate and ship preview.
- [ ] 4.7 Append evidence ledger rows.
- [ ] 4.8 Commit task closure, push branch, and create draft PR stacked on
  `feat/auth-db-production-implementation`.
- [ ] 4.9 Compound learning decision: record `none` unless a repeatable process
  issue appears.
