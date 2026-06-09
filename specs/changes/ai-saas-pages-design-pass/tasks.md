# Tasks — ai-saas-pages-design-pass

> Schema v2 (ADR-0015). Each task entry includes `verify`, `red_at`, and
> `status`. Production tasks follow TDD before implementation.

## Meta

```yaml
change_id: ai-saas-pages-design-pass
spec_version: v2
created: 2026-05-31
plan_ref: specs/changes/ai-saas-pages-design-pass/design.md
```

## Tasks

```yaml
- id: T-001
  title: Spec and baseline
  files:
    - specs/changes/ai-saas-pages-design-pass/**
  covers:
    - ai-saas-pages/R1-S1
  verify: |
    cdc-workflow gate --mode standard --root .                              # expected: exit 0
    test -f specs/changes/ai-saas-pages-design-pass/proposal.md             # expected: exit 0
    test -f specs/changes/ai-saas-pages-design-pass/design.md               # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 20min
  depends_on: []

- id: T-002
  title: Lock AI support page semantic regions
  files:
    - site/app/app/__tests__/ai-pages.test.tsx
    - site/app/app/templates/page.tsx
    - site/app/app/brand-voice/page.tsx
    - site/app/app/history/page.tsx
    - site/app/app/analytics/page.tsx
    - site/app/app/settings/page.tsx
  covers:
    - ai-template-library/R1-S1
    - ai-brand-voice-manager/R1-S1
    - ai-history-operations/R1-S1
    - ai-analytics-settings/R1-S1
  verify: |
    pnpm --dir site test -- ai-pages                                        # expected: exit 0
  red_at: 2026-05-31T14:45:29Z
  status: done
  owner_mode: active
  estimate: 90min
  depends_on:
    - T-001

- id: T-003
  title: Add E2E navigation coverage for support page regions
  files:
    - site/e2e/ai-navigation.spec.ts
  covers:
    - ai-saas-pages/R2-S1
  verify: |
    pnpm --dir site test:e2e -- ai-navigation                               # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 40min
  depends_on:
    - T-002

- id: T-004
  title: Browser QA and ship evidence
  files:
    - .cdc/state/evidence.jsonl
    - .cdc/state/compound.jsonl
  covers:
    - ai-saas-pages/R3-S1
  verify: |
    pnpm --dir site lint                                                     # expected: exit 0
    pnpm --dir site type-check                                               # expected: exit 0
    pnpm --dir site test                                                     # expected: exit 0
    pnpm --dir site test:e2e                                                 # expected: exit 0
    pnpm --dir site build                                                    # expected: exit 0
    cdc-workflow gate --mode standard --root .                               # expected: exit 0
    cdc-workflow ship-preview --change ai-saas-pages-design-pass --root .    # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 35min
  depends_on:
    - T-003
```
