# Tasks — seo-discovery-manifests-pass

> Schema v2 (ADR-0015). Each task entry includes `verify`, `red_at`, and
> `status`. Production tasks follow TDD before implementation.

## Meta

```yaml
change_id: seo-discovery-manifests-pass
spec_version: v2
created: 2026-06-01
plan_ref: specs/changes/seo-discovery-manifests-pass/design.md
```

## Tasks

```yaml
- id: T-001
  title: Spec and baseline
  files:
    - specs/changes/seo-discovery-manifests-pass/**
  covers:
    - sitemap-discovery/R1-S1
  verify: |
    cdc-workflow gate --mode standard --root .                            # expected: exit 0
    test -f specs/changes/seo-discovery-manifests-pass/proposal.md         # expected: exit 0
    test -f specs/changes/seo-discovery-manifests-pass/design.md           # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 20min
  depends_on: []

- id: T-002
  title: Lock manifest helper contracts
  files:
    - site/lib/seo/index.ts
    - site/lib/seo/__tests__/metadata.test.ts
  covers:
    - sitemap-discovery/R1-S1
    - robots-policy/R1-S1
    - llms-index/R1-S1
  verify: |
    pnpm --dir site test -- metadata                                      # expected: exit 0
  red_at: 2026-06-01T14:15:17Z
  status: done
  owner_mode: active
  estimate: 60min
  depends_on:
    - T-001

- id: T-003
  title: Expose Next.js manifest routes
  files:
    - site/app/sitemap.ts
    - site/app/robots.ts
    - site/app/llms.txt/route.ts
    - site/e2e/seo.spec.ts
  covers:
    - sitemap-discovery/R2-S1
    - robots-policy/R2-S1
    - llms-index/R2-S1
  verify: |
    pnpm --dir site test:e2e -- seo                                      # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 60min
  depends_on:
    - T-002

- id: T-004
  title: Final verification and ship evidence
  files:
    - .cdc/state/evidence.jsonl
    - .cdc/state/compound.jsonl
  covers:
    - sitemap-discovery/R3-S1
  verify: |
    pnpm --dir site lint                                                   # expected: exit 0
    pnpm --dir site type-check                                             # expected: exit 0
    pnpm --dir site test                                                   # expected: exit 0
    pnpm --dir site test:e2e                                               # expected: exit 0
    pnpm --dir site build                                                  # expected: exit 0
    cdc-workflow gate --mode standard --root .                             # expected: exit 0
    cdc-workflow ship-preview --change seo-discovery-manifests-pass --root . # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: active
  estimate: 35min
  depends_on:
    - T-003
```
