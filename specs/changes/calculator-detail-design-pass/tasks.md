# Tasks — calculator-detail-design-pass

> Schema v2 (ADR-0015). Each task entry includes `verify`, `red_at`, and
> `status`. Production tasks follow TDD before implementation.

## Meta

```yaml
change_id: calculator-detail-design-pass
spec_version: v2
created: 2026-05-31
plan_ref: specs/changes/calculator-detail-design-pass/design.md
```

## Tasks

```yaml
- id: T-001
  title: Spec and baseline
  files:
    - specs/changes/calculator-detail-design-pass/**
  covers:
    - calculator-detail-qa/R1-S1
  verify: |
    cdc-workflow gate --mode standard --root .                                  # expected: exit 0
    test -f specs/changes/calculator-detail-design-pass/proposal.md             # expected: exit 0
    test -f specs/changes/calculator-detail-design-pass/design.md               # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 20min
  depends_on: []

- id: T-002
  title: Lock calculator detail page contract
  files:
    - site/components/calculators/__tests__/calculator-workspace.test.tsx
    - site/app/__tests__/calculator-detail-page.test.tsx
    - site/app/tools/[slug]/page.tsx
    - site/components/calculators/calculator-workspace.tsx
  covers:
    - calculator-detail-workspace/R1-S1
    - calculator-detail-actions/R1-S1
    - calculator-detail-seo/R1-S1
  verify: |
    pnpm --dir site test -- calculator-workspace                                # expected: exit 0
  red_at: 2026-05-31T13:55:52Z
  status: done
  owner_mode: active
  estimate: 45min
  depends_on:
    - T-001

- id: T-003
  title: Verify detail route SEO and interaction flow
  files:
    - site/e2e/calculators.spec.ts
    - site/app/tools/[slug]/page.tsx
  covers:
    - calculator-detail-workspace/R2-S1
    - calculator-detail-seo/R2-S1
  verify: |
    pnpm --dir site test:e2e -- calculators                                     # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 35min
  depends_on:
    - T-002

- id: T-004
  title: Browser QA and ship evidence
  files:
    - .cdc/state/evidence.jsonl
    - .cdc/state/compound.jsonl
  covers:
    - calculator-detail-qa/R2-S1
  verify: |
    pnpm --dir site lint                                                        # expected: exit 0
    pnpm --dir site type-check                                                  # expected: exit 0
    pnpm --dir site test                                                        # expected: exit 0
    pnpm --dir site test:e2e                                                    # expected: exit 0
    cdc-workflow gate --mode standard --root .                                  # expected: exit 0
    cdc-workflow ship-preview --change calculator-detail-design-pass --root .   # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 35min
  depends_on:
    - T-003
```
