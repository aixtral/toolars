# Tasks — merge-toolars-platform

> Schema v2 (ADR-0015). Each task entry includes `verify`, `red_at`, and
> `status`. Production tasks must follow TDD before implementation.

## Meta

```yaml
change_id: merge-toolars-platform
spec_version: v2
created: 2026-05-30
plan_ref: docs/architecture/IMPLEMENTATION-PLAN.md
```

## Tasks

```yaml
- id: T-001
  title: Initialize repository guardrails (non-prod)
  files:
    - AGENTS.md
    - CLAUDE.md
    - README.md
    - site/README.md
    - .gitignore
    - .cdc/CONTEXT.md
    - .cdc/ARCHITECTURE.md
  covers:
    - P1-S1
    - P1-S2
  verify: |
    git status --short                                      # expected: repo initialized; files visible as untracked/changed before first commit
    cdc-workflow gate --mode standard --root .              # expected: exit 0
  red_at: N/A
  status: done
  owner_mode: AFK
  estimate: 20min
  depends_on: []

- id: T-002
  title: Create product and architecture documentation (non-prod)
  files:
    - docs/product/PRD.md
    - design/DESIGN-SPEC.md
    - docs/architecture/TECHNICAL-ARCHITECTURE.md
    - docs/architecture/MIGRATION-PLAN.md
    - docs/architecture/IMPLEMENTATION-PLAN.md
    - docs/qa/ACCEPTANCE-CRITERIA.md
  covers:
    - P2-S1
    - P2-S2
    - D1-S1
  verify: |
    test -f docs/product/PRD.md                             # expected: exit 0
    test -f docs/architecture/TECHNICAL-ARCHITECTURE.md      # expected: exit 0
    test -f design/DESIGN-SPEC.md                            # expected: exit 0
    rg "Next.js App Router" docs .cdc specs                 # expected: exit 0; framework decision recorded
  red_at: N/A
  status: done
  owner_mode: AFK
  estimate: 45min
  depends_on:
    - T-001

- id: T-003
  title: Scaffold Next.js App Router application
  files:
    - site/package.json
    - site/app/page.tsx
    - site/app/layout.tsx
    - site/tsconfig.json
    - site/tailwind.config.ts
    - site/vitest.config.ts
    - site/playwright.config.ts
  covers:
    - P1-S2
    - D2-S1
  verify: |
    pnpm --dir site lint                                    # expected: exit 0
    pnpm --dir site type-check                              # expected: exit 0
    pnpm --dir site test                                    # expected: exit 0
  red_at: 2026-05-30T15:19:57Z
  status: done
  owner_mode: AFK
  estimate: 2h
  depends_on:
    - T-002

- id: T-004
  title: Implement design tokens and UI primitives
  files:
    - site/app/globals.css
    - site/components/ui
    - site/components/layout
  covers:
    - D1-S1
    - D3-S2
  verify: |
    pnpm --dir site test -- ui                              # expected: exit 0; token/component tests pass
    pnpm --dir site type-check                              # expected: exit 0
  red_at: 2026-05-30T15:49:33Z
  status: done
  owner_mode: AFK
  estimate: 3h
  depends_on:
    - T-003

- id: T-005
  title: Implement tool registry and search index
  files:
    - site/data/tools.ts
    - site/data/categories.ts
    - site/data/calculators/index.ts
    - site/data/ai-tools.ts
    - site/lib/search
  covers:
    - T1-S1
    - T1-S2
    - A3-S1
  verify: |
    pnpm --dir site test -- tools                           # expected: exit 0; unique slugs and route coverage pass
    pnpm --dir site test -- search                          # expected: exit 0; search index includes calculators and AI tools
  red_at: 2026-05-30T15:53:43Z
  status: done
  owner_mode: AFK
  estimate: 4h
  depends_on:
    - T-003

- id: T-006
  title: Implement navigation and command palette
  files:
    - site/components/navigation
    - site/components/search
    - site/components/layout/header.tsx
  covers:
    - D2-S1
    - D3-S1
  verify: |
    pnpm --dir site test -- navigation                      # expected: exit 0; menu and drawer component tests pass
    pnpm --dir site test:e2e -- search                      # expected: exit 0; Cmd/Ctrl+K and Esc flows pass
  red_at: 2026-05-30T16:20:19Z
  status: done
  owner_mode: AFK
  estimate: 4h
  depends_on:
    - T-004
    - T-005

- id: T-007
  title: Implement public discovery pages
  files:
    - site/app/page.tsx
    - site/app/tools/page.tsx
    - site/app/categories/health/page.tsx
    - site/app/categories/finance/page.tsx
    - site/app/ai/page.tsx
    - site/components/tools
    - site/lib/discovery
    - site/lib/seo
    - site/e2e/public-pages.spec.ts
    - site/public/assets/icons/toolars
  covers:
    - D2-S1
    - D2-S2
    - P2-S1
    - T1-S2
  verify: |
    pnpm --dir site test:e2e -- public-pages                # expected: exit 0; home/tools/category/AI directory render
    pnpm --dir site test -- metadata                        # expected: exit 0; public metadata helpers pass
  red_at: 2026-05-31T05:27:14Z
  status: done
  owner_mode: AFK
  estimate: 5h
  depends_on:
    - T-006

- id: T-008
  title: Port calculator formulas into pure modules
  files:
    - site/data/calculators/index.ts
    - site/lib/calculators
    - site/lib/formatting
  covers:
    - T3-S1
    - T3-S2
  verify: |
    pnpm --dir site test -- calculators                     # expected: exit 0; formula and validation tests pass
    rg "document|window|fetch|useState" site/lib/calculators # expected: exit 1; pure modules do not use DOM/network/React APIs
  red_at: 2026-05-31T06:00:26Z
  status: done
  owner_mode: AFK
  estimate: 8h
  depends_on:
    - T-005

- id: T-009
  title: Implement shared calculator pages and local utility actions
  files:
    - site/app/tools/[slug]/page.tsx
    - site/components/calculators
    - site/components/tools
    - site/lib/storage
  covers:
    - T1-S1
    - T2-S1
    - T2-S2
    - M1-S1
    - M1-S2
  verify: |
    pnpm --dir site test -- calculators                     # expected: exit 0; template state tests pass
    pnpm --dir site test:e2e -- calculators                 # expected: exit 0; anonymous calculate/save/compare/share flows pass
  red_at: 2026-05-31T06:09:08Z
  status: done
  owner_mode: AFK
  estimate: 8h
  depends_on:
    - T-008

- id: T-010
  title: Implement AI app shell and repurpose workflow
  files:
    - site/app/app/layout.tsx
    - site/app/app/repurpose/page.tsx
    - site/app/api/ai/repurpose/route.ts
    - site/components/ai
    - site/lib/ai
  covers:
    - A1-S1
    - A1-S2
    - A2-S1
    - A2-S2
  verify: |
    pnpm --dir site test -- ai                              # expected: exit 0; app shell and generation state tests pass
    pnpm --dir site test:e2e -- ai-repurpose                # expected: exit 0; auth guard, generate, stream, cancel pass
  red_at: pending-red
  status: pending
  owner_mode: AFK
  estimate: 8h
  depends_on:
    - T-004
    - T-006

- id: T-011
  title: Implement AI SaaS supporting pages
  files:
    - site/app/app/templates/page.tsx
    - site/app/app/brand-voice/page.tsx
    - site/app/app/history/page.tsx
    - site/app/app/analytics/page.tsx
    - site/app/app/settings/page.tsx
    - site/data/ai-platforms.ts
  covers:
    - A3-S1
    - A3-S2
  verify: |
    pnpm --dir site test -- ai-pages                        # expected: exit 0; all AI page component tests pass
    pnpm --dir site test:e2e -- ai-navigation               # expected: exit 0; app navigation covers all AI pages
  red_at: pending-red
  status: pending
  owner_mode: AFK
  estimate: 6h
  depends_on:
    - T-010

- id: T-012
  title: Implement auth billing and Pro gates
  files:
    - site/lib/auth
    - site/lib/billing
    - site/lib/plans
    - site/app/api/billing/webhook/route.ts
    - site/components/billing
  covers:
    - M2-S1
    - M2-S2
    - A1-S1
  verify: |
    pnpm --dir site test -- billing                         # expected: exit 0; plan gates and webhook verification pass
    pnpm --dir site test:e2e -- auth-billing                # expected: exit 0; login, subscription, and Pro gate flows pass
  red_at: pending-red
  status: pending
  owner_mode: HITL
  estimate: 8h
  depends_on:
    - T-010

- id: T-013
  title: Implement SEO content and i18n architecture
  files:
    - site/lib/seo
    - site/lib/i18n
    - site/app/blog
    - site/data/locales
  covers:
    - I1-S1
    - I2-S1
    - I2-S2
  verify: |
    pnpm --dir site test -- seo                             # expected: exit 0; schema and metadata tests pass
    pnpm --dir site test:e2e -- seo                         # expected: exit 0; representative public pages expose metadata
  red_at: pending-red
  status: pending
  owner_mode: AFK
  estimate: 6h
  depends_on:
    - T-007
    - T-009

- id: T-014
  title: Run final verification and ship preview
  files:
    - site
    - specs/changes/merge-toolars-platform
  covers:
    - P2-S1
    - T1-S1
    - A3-S1
    - M1-S1
    - I1-S1
  verify: |
    pnpm --dir site lint                                    # expected: exit 0
    pnpm --dir site type-check                              # expected: exit 0
    pnpm --dir site test                                    # expected: exit 0
    pnpm --dir site test:e2e                                # expected: exit 0
    cdc-workflow gate --mode standard --root .              # expected: exit 0
    cdc-workflow ship-preview --change merge-toolars-platform --root . # expected: preview generated
  red_at: pending-red
  status: pending
  owner_mode: HITL
  estimate: 2h
  depends_on:
    - T-011
    - T-012
    - T-013
```
