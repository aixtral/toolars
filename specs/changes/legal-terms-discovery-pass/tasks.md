# Tasks — legal-terms-discovery-pass

> Schema v2 (ADR-0015). Production tasks follow TDD before implementation.

## Meta

```yaml
change_id: legal-terms-discovery-pass
spec_version: v2
created: 2026-06-04
plan_ref: specs/changes/legal-terms-discovery-pass/design.md
```

## Tasks

```yaml
- id: T-001
  title: Spec and baseline
  files:
    - specs/changes/legal-terms-discovery-pass/**
  covers:
    - legal-terms/R1-S1
  verify: |
    cdc-workflow gate --mode standard --root .                             # expected: exit 0
    test -f specs/changes/legal-terms-discovery-pass/proposal.md            # expected: exit 0
    test -f specs/changes/legal-terms-discovery-pass/design.md              # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 20min
  depends_on: []

- id: T-002
  title: Lock Terms route and discovery expectations with failing tests
  files:
    - site/app/__tests__/commercial-pages.test.tsx
    - site/components/layout/__tests__/footer.test.tsx
    - site/lib/seo/__tests__/metadata.test.ts
    - site/e2e/public-pages.spec.ts
    - site/e2e/seo.spec.ts
  covers:
    - legal-terms/R2-S1
    - legal-terms/R3-S1
  verify: |
    pnpm --dir site test -- commercial-pages footer metadata                # expected: red before implementation
  red_at: 2026-06-04T15:00:03Z
  status: done
  owner_mode: active
  estimate: 35min
  depends_on:
    - T-001

- id: T-003
  title: Implement Terms page and discovery updates
  files:
    - site/app/terms/page.tsx
    - site/components/layout/footer.tsx
    - site/lib/seo/index.ts
  covers:
    - legal-terms/R2-S1
    - legal-terms/R3-S1
  verify: |
    pnpm --dir site test -- commercial-pages footer metadata                # expected: exit 0
    pnpm --dir site test:e2e -- public-pages seo                            # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 60min
  depends_on:
    - T-002

- id: T-004
  title: Final verification and ship evidence
  files:
    - specs/changes/legal-terms-discovery-pass/tasks.md
  covers:
    - legal-terms/R4-S1
  verify: |
    pnpm --dir site lint                                                     # expected: exit 0
    pnpm --dir site type-check                                               # expected: exit 0
    pnpm --dir site test                                                     # expected: exit 0
    pnpm --dir site test:e2e                                                 # expected: exit 0
    pnpm --dir site build                                                    # expected: exit 0
    cdc-workflow gate --mode standard --root .                               # expected: exit 0
    cdc-workflow ship-preview --change legal-terms-discovery-pass --root .   # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 45min
  depends_on:
    - T-003
```
