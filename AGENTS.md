# AGENTS.md — toolars Project Instructions

## Project Identity

`toolars` is the new primary repository for a unified overseas tools website.
It merges:

- AI content repurposing SaaS functionality from `aixtral-labs`.
- 73 calculator/tool pages and content patterns from `aixtral-calm/vitalcalc`.

The source of truth for visual and interaction design is
`design/DESIGN.md`. Generated PNGs in `design/images/` are visual reference
assets, not exhaustive page requirements.

## Repository Layout

- `site/`: all production website/application code. Future Next.js App Router
  implementation lives here.
- `docs/`: product, architecture, QA, migration, and implementation documents,
  excluding generated visual-design assets.
- `design/`: design-system documentation, generated PNGs, icon assets, and
  design-related references.
- `.cdc/`: CDC workflow context and architecture guardrails.
- `specs/`: CDC change proposals and implementation specs.

Do not place application code at the repository root.

## Product Decisions

- Build `/Users/stanvl/Documents/dev/ai-repo/toolars` as the new main repo.
- Use Next.js App Router as the unified site/app framework.
- Ship v1 with all 73 calculators and all AI SaaS pages in scope.
- Calculators are free and usable without login.
- AI tools are subscription-gated.
- Cross-device saving, PDF/CSV advanced exports, and batch tooling can be Pro.
- Migrate feature inventory and formula logic from the source projects, but
  rebuild UI according to `design/DESIGN.md`.
- Write public product copy English-first.
- Keep i18n architecture ready; phase two migrates es/fr/zh/ja/ru/ar/pt/hi/zh-tw.

## CDC Workflow

Use CDC Standard mode for this repo unless the task is only a tiny docs edit.
Before implementation work:

1. Check `.cdc/CONTEXT.md` and `.cdc/ARCHITECTURE.md`.
2. Keep specs under `specs/changes/<change-id>/`.
3. Follow TDD for production code. Documentation/config-only changes may name
   the TDD exception in closeout.
4. Run the smallest relevant verification command before claiming completion.

Recommended gates:

```bash
cdc-workflow gate --mode standard --root .
cdc-doctor --context-budget --repo . --json
```

## Engineering Rules

- Keep changes surgical.
- Do not port old UI wholesale.
- Use a central Tool Registry and shared calculator template.
- Keep pure calculator logic independent from React, browser APIs, network, and
  account state.
- Do not gate basic calculators behind login.
- Preserve SEO crawlability for public pages.
- Keep account, billing, AI provider, and database concerns outside public
  calculator components.

## Design Rules

- Use `design/DESIGN.md` for tokens, layout, component states, accessibility,
  SEO, and route guidance.
- Utility UX comes first: search, categories, recent/favorites, quick actions.
- Avoid generic AI-purple SaaS visuals, decorative blobs, stock photos, and
  oversized marketing hero sections.
- Use border-first hierarchy, 8px primary radius, Inter/system fonts, and
  Lucide-style icons.

