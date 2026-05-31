# Tasks — design-conformance-pass

> Schema v2 (ADR-0015). Each task entry includes `verify`, `red_at`, and
> `status`. Production tasks follow TDD before implementation.

## Meta

```yaml
change_id: design-conformance-pass
spec_version: v2
created: 2026-05-31
plan_ref: specs/changes/design-conformance-pass/design.md
```

## Tasks

```yaml
- id: T-001
  title: Spec and baseline
  files:
    - specs/changes/design-conformance-pass/**
  covers:
    - visual-qa/R1-S1
  verify: |
    cdc-workflow gate --mode standard --root .                 # expected: exit 0
    test -f specs/changes/design-conformance-pass/proposal.md  # expected: exit 0
    test -f specs/changes/design-conformance-pass/design.md    # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 20min
  depends_on: []

- id: T-002
  title: Lock home dashboard contract
  files:
    - site/app/__tests__/page.test.tsx
    - site/app/page.tsx
  covers:
    - visual-dashboard/R1-S1
    - visual-dashboard/R1-S2
    - visual-dashboard/R1-S3
  verify: |
    pnpm --dir site test -- page                               # expected: exit 0
  red_at: 2026-05-31T10:17:01Z
  status: done
  owner_mode: active
  estimate: 30min
  depends_on:
    - T-001

- id: T-003
  title: Upgrade shared tool card affordances
  files:
    - site/components/tools/tool-card.tsx
    - site/components/tools/__tests__/tool-card.test.tsx
  covers:
    - tool-card-affordances/R1-S1
    - tool-card-affordances/R1-S2
    - tool-card-affordances/R1-S3
  verify: |
    pnpm --dir site test -- tool-card                          # expected: exit 0
  red_at: 2026-05-31T10:18:46Z
  status: done
  owner_mode: active
  estimate: 35min
  depends_on:
    - T-002

- id: T-004
  title: Improve directory filter framing
  files:
    - site/app/tools/page.tsx
    - site/app/__tests__/tools-page.test.tsx
  covers:
    - visual-dashboard/R2-S1
    - visual-dashboard/R2-S2
  verify: |
    pnpm --dir site test -- tools-page                         # expected: exit 0
  red_at: 2026-05-31T10:20:12Z
  status: done
  owner_mode: active
  estimate: 25min
  depends_on:
    - T-003

- id: T-005
  title: Browser QA and ship evidence
  files:
    - .cdc/state/evidence.jsonl
    - .cdc/state/compound.jsonl
  covers:
    - visual-qa/R1-S1
    - visual-qa/R1-S2
  verify: |
    pnpm --dir site lint                                       # expected: exit 0
    pnpm --dir site type-check                                 # expected: exit 0
    pnpm --dir site test                                       # expected: exit 0
    pnpm --dir site test:e2e                                   # expected: exit 0
    cdc-workflow gate --mode standard --root .                 # expected: exit 0
    cdc-workflow ship-preview --change design-conformance-pass --root . # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 30min
  depends_on:
    - T-004
```
