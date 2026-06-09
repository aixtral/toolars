# Tasks — ai-repurpose-dashboard-pass

> Schema v2 (ADR-0015). Each task entry includes `verify`, `red_at`, and
> `status`. Production tasks follow TDD before implementation.

## Meta

```yaml
change_id: ai-repurpose-dashboard-pass
spec_version: v2
created: 2026-05-31
plan_ref: specs/changes/ai-repurpose-dashboard-pass/design.md
```

## Tasks

```yaml
- id: T-001
  title: Spec and baseline
  files:
    - specs/changes/ai-repurpose-dashboard-pass/**
  covers:
    - ai-dashboard-qa/R1-S1
  verify: |
    cdc-workflow gate --mode standard --root .                              # expected: exit 0
    test -f specs/changes/ai-repurpose-dashboard-pass/proposal.md            # expected: exit 0
    test -f specs/changes/ai-repurpose-dashboard-pass/design.md              # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 20min
  depends_on: []

- id: T-002
  title: Lock AI workspace contract
  files:
    - site/components/ai/__tests__/repurpose-workspace.test.tsx
    - site/components/ai/repurpose-workspace.tsx
  covers:
    - ai-input-controls/R1-S1
    - ai-output-management/R1-S1
    - ai-history-context/R1-S1
  verify: |
    pnpm --dir site test -- repurpose-workspace                             # expected: exit 0
  red_at: 2026-05-31T14:21:53Z
  status: done
  owner_mode: active
  estimate: 45min
  depends_on:
    - T-001

- id: T-003
  title: Upgrade route shell and E2E contract
  files:
    - site/app/app/repurpose/page.tsx
    - site/e2e/ai-repurpose.spec.ts
  covers:
    - ai-workspace-shell/R1-S1
    - ai-dashboard-qa/R2-S1
  verify: |
    pnpm --dir site test:e2e -- ai-repurpose                                # expected: exit 0
  red_at: 2026-05-31T14:23:44Z
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
    - ai-dashboard-qa/R3-S1
  verify: |
    pnpm --dir site lint                                                     # expected: exit 0
    pnpm --dir site type-check                                               # expected: exit 0
    pnpm --dir site test                                                     # expected: exit 0
    pnpm --dir site test:e2e                                                 # expected: exit 0
    pnpm --dir site build                                                    # expected: exit 0
    cdc-workflow gate --mode standard --root .                               # expected: exit 0
    cdc-workflow ship-preview --change ai-repurpose-dashboard-pass --root .  # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 35min
  depends_on:
    - T-003
```
