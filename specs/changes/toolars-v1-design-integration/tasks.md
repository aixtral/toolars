# Tasks — toolars-v1-design-integration

> Schema v2 (ADR-0015). This is a branch integration task. TDD exception:
> integration-only work; no new production logic unless conflict resolution
> requires it.

## Meta

```yaml
change_id: toolars-v1-design-integration
spec_version: v2
created: 2026-06-02
plan_ref: specs/changes/toolars-v1-design-integration/design.md
```

## Tasks

```yaml
- id: T-001
  title: Spec and branch baseline
  files:
    - specs/changes/toolars-v1-design-integration/**
  covers:
    - integrated-v1-design-stack/R1-S1
  verify: |
    cdc-workflow gate --mode standard --root .                            # expected: exit 0
    test -f specs/changes/toolars-v1-design-integration/proposal.md        # expected: exit 0
    test -f specs/changes/toolars-v1-design-integration/design.md          # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 20min
  depends_on: []

- id: T-002
  title: Merge calculator detail design pass
  files:
    - site/**
    - specs/changes/calculator-detail-design-pass/**
  covers:
    - integrated-v1-design-stack/R2-S1
  verify: |
    git merge-base --is-ancestor origin/feat/calculator-detail-design-pass HEAD # expected: exit 0
  red_at: N/A
  status: in_progress
  owner_mode: active
  estimate: 45min
  depends_on:
    - T-001

- id: T-003
  title: Full integrated verification
  files:
    - .cdc/state/evidence.jsonl
    - .cdc/state/compound.jsonl
  covers:
    - integrated-v1-design-stack/R3-S1
  verify: |
    pnpm --dir site lint                                                   # expected: exit 0
    pnpm --dir site type-check                                             # expected: exit 0
    pnpm --dir site test                                                   # expected: exit 0
    pnpm --dir site test:e2e                                               # expected: exit 0
    pnpm --dir site build                                                  # expected: exit 0
    cdc-workflow gate --mode standard --root .                             # expected: exit 0
    cdc-workflow ship-preview --change toolars-v1-design-integration --root . # expected: exit 0
  red_at: N/A
  status: pending
  owner_mode: active
  estimate: 60min
  depends_on:
    - T-002
```
