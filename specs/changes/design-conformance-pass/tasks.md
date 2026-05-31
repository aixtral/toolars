# Tasks: design-conformance-pass

mode: standard
branch: feat/design-conformance-pass

## T-001 — Spec And Baseline

status: done
owner_mode: active
files:
  - specs/changes/design-conformance-pass/**
verify: |
  cdc-workflow gate --mode standard --root .                 # expected: exit 0
  test -f specs/changes/design-conformance-pass/proposal.md  # expected: exit 0
  test -f specs/changes/design-conformance-pass/design.md    # expected: exit 0
covers:
  - visual-qa/R1-S1

## T-002 — Lock Home Dashboard Contract

status: done
owner_mode: active
files:
  - site/app/__tests__/page.test.tsx
  - site/app/page.tsx
verify: |
  pnpm --dir site test -- page                               # expected: exit 0
covers:
  - visual-dashboard/R1-S1
  - visual-dashboard/R1-S2
  - visual-dashboard/R1-S3

## T-003 — Upgrade Shared Tool Card Affordances

status: done
owner_mode: active
files:
  - site/components/tools/tool-card.tsx
  - site/components/tools/__tests__/tool-card.test.tsx
verify: |
  pnpm --dir site test -- tool-card                          # expected: exit 0
covers:
  - tool-card-affordances/R1-S1
  - tool-card-affordances/R1-S2
  - tool-card-affordances/R1-S3

## T-004 — Improve Directory Filter Framing

status: done
owner_mode: active
files:
  - site/app/tools/page.tsx
  - site/app/__tests__/tools-page.test.tsx
verify: |
  pnpm --dir site test -- tools-page                         # expected: exit 0
covers:
  - visual-dashboard/R2-S1
  - visual-dashboard/R2-S2

## T-005 — Browser QA And Ship Evidence

status: pending
owner_mode: active
files:
  - .cdc/state/evidence.jsonl
  - .cdc/state/compound.jsonl
verify: |
  pnpm --dir site lint                                       # expected: exit 0
  pnpm --dir site type-check                                 # expected: exit 0
  pnpm --dir site test                                       # expected: exit 0
  pnpm --dir site test:e2e                                   # expected: exit 0
  cdc-workflow evidence-gate --change design-conformance-pass --root . # expected: exit 0
covers:
  - visual-qa/R1-S1
  - visual-qa/R1-S2
