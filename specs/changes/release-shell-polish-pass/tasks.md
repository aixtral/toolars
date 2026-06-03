# Tasks — release-shell-polish-pass

> Schema v2 (ADR-0015). Production tasks follow TDD before implementation.

## Meta

```yaml
change_id: release-shell-polish-pass
spec_version: v2
created: 2026-06-03
plan_ref: specs/changes/release-shell-polish-pass/design.md
```

## Tasks

```yaml
- id: T-001
  title: Spec and baseline
  files:
    - specs/changes/release-shell-polish-pass/**
  covers:
    - release-shell/R1-S1
  verify: |
    cdc-workflow gate --mode standard --root .                             # expected: exit 0
    test -f specs/changes/release-shell-polish-pass/proposal.md             # expected: exit 0
    test -f specs/changes/release-shell-polish-pass/design.md               # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 20min
  depends_on: []

- id: T-002
  title: Lock footer and 404 behavior with failing tests
  files:
    - site/components/layout/__tests__/footer.test.tsx
    - site/app/__tests__/not-found.test.tsx
    - site/e2e/release-shell.spec.ts
  covers:
    - release-shell/R2-S1
    - release-shell/R3-S1
  verify: |
    pnpm --dir site test -- footer not-found                                # expected: red before implementation, exit non-zero
  red_at: 2026-06-03T14:00:38Z
  status: done
  owner_mode: active
  estimate: 30min
  depends_on:
    - T-001

- id: T-003
  title: Implement footer and custom 404
  files:
    - site/components/layout/footer.tsx
    - site/components/layout/index.ts
    - site/app/layout.tsx
    - site/app/not-found.tsx
  covers:
    - release-shell/R2-S1
    - release-shell/R3-S1
  verify: |
    pnpm --dir site test -- footer not-found                                # expected: exit 0
    pnpm --dir site test:e2e -- release-shell                               # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 60min
  depends_on:
    - T-002

- id: T-004
  title: Final verification and ship evidence
  files:
    - specs/changes/release-shell-polish-pass/tasks.md
  covers:
    - release-shell/R4-S1
  verify: |
    pnpm --dir site lint                                                     # expected: exit 0
    pnpm --dir site type-check                                               # expected: exit 0
    pnpm --dir site test                                                     # expected: exit 0
    pnpm --dir site test:e2e                                                 # expected: exit 0
    pnpm --dir site build                                                    # expected: exit 0
    cdc-workflow gate --mode standard --root .                               # expected: exit 0
    cdc-workflow ship-preview --change release-shell-polish-pass --root .    # expected: exit 0
  red_at: N/A
  status: in_progress
  owner_mode: active
  estimate: 45min
  depends_on:
    - T-003
```
