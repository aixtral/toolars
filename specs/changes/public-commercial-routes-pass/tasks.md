# Tasks — public-commercial-routes-pass

> Schema v2 (ADR-0015). Each task entry includes `verify`, `red_at`, and
> `status`. Production tasks follow TDD before implementation.

## Meta

```yaml
change_id: public-commercial-routes-pass
spec_version: v2
created: 2026-05-31
plan_ref: specs/changes/public-commercial-routes-pass/design.md
```

## Tasks

```yaml
- id: T-001
  title: Spec and baseline
  files:
    - specs/changes/public-commercial-routes-pass/**
  covers:
    - commercial-routes/R1-S1
  verify: |
    cdc-workflow gate --mode standard --root .                               # expected: exit 0
    test -f specs/changes/public-commercial-routes-pass/proposal.md           # expected: exit 0
    test -f specs/changes/public-commercial-routes-pass/design.md             # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 20min
  depends_on: []

- id: T-002
  title: Lock route page contracts
  files:
    - site/app/__tests__/commercial-pages.test.tsx
    - site/app/pricing/page.tsx
    - site/app/login/page.tsx
    - site/app/register/page.tsx
    - site/app/compare/page.tsx
    - site/app/about/page.tsx
    - site/app/contact/page.tsx
    - site/app/privacy/page.tsx
    - site/app/en/page.tsx
  covers:
    - commercial-routes/R1-S1
    - account-entry/R1-S1
    - compare-workflow/R1-S1
    - trust-pages/R1-S1
  verify: |
    pnpm --dir site test -- commercial-pages                                  # expected: exit 0
  red_at: 2026-05-31T15:01:57Z
  status: done
  owner_mode: active
  estimate: 90min
  depends_on:
    - T-001

- id: T-003
  title: Add E2E coverage for linked commercial routes
  files:
    - site/e2e/public-pages.spec.ts
  covers:
    - commercial-routes/R2-S1
  verify: |
    pnpm --dir site test:e2e -- public-pages                                  # expected: exit 0
  red_at: 2026-05-31T15:06:10Z
  status: done
  owner_mode: active
  estimate: 45min
  depends_on:
    - T-002

- id: T-004
  title: Final verification and ship evidence
  files:
    - .cdc/state/evidence.jsonl
    - .cdc/state/compound.jsonl
  covers:
    - commercial-routes/R3-S1
  verify: |
    pnpm --dir site lint                                                      # expected: exit 0
    pnpm --dir site type-check                                                # expected: exit 0
    pnpm --dir site test                                                      # expected: exit 0
    pnpm --dir site test:e2e                                                  # expected: exit 0
    pnpm --dir site build                                                     # expected: exit 0
    cdc-workflow gate --mode standard --root .                                # expected: exit 0
    cdc-workflow ship-preview --change public-commercial-routes-pass --root . # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 35min
  depends_on:
    - T-003
```
