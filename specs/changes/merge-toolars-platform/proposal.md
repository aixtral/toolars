# Proposal: merge-toolars-platform

## Business Context

toolars is the new primary repository for a unified overseas tools platform.
The product merges an AI content repurposing SaaS with a 73-calculator public
tools directory under one brand, information architecture, and design system.

The current repository contains the design handoff and documentation baseline.
Implementation will live under `site/`.

## Problem Statement

The source products solve adjacent problems but are split across different
brands, stacks, and UI systems:

- `aixtral-labs` contains the AI SaaS surface.
- `aixtral-calm/vitalcalc` contains the calculator/tool directory.

The current design handoff defines a stronger unified product direction, but
implementation needs a traceable product/architecture contract before code
starts.

## Scope

### Included

- Initialize `toolars` as the new main repo.
- Use Next.js App Router as the unified framework.
- Keep all future production application code under `site/`.
- Keep non-design docs under `docs/`.
- Keep design handoff and visual assets under `design/`.
- Use `design/DESIGN.md` as product/design source of truth.
- Define all v1 product requirements and architecture docs.
- Plan v1 with all 73 calculators and all AI SaaS pages in release scope.
- Keep calculators free and usable without login.
- Gate AI tools behind account/subscription.
- Treat cross-device save, advanced PDF/CSV exports, and batch tools as Pro
  candidates.
- Build English-first public UX while preserving future i18n architecture.

### Not Included

- Implementing the Next.js application in this documentation change.
- Shipping production calculator logic in this change.
- Migrating non-English content in v1 implementation scope.
- Copying old UI components wholesale from source projects.
- Requiring login for basic calculator use.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Product cohesion | Two separate projects | One unified toolars product |
| Calculator UX | Existing VitalCalc UI | Rebuilt under toolars design system |
| AI SaaS UX | Existing XtralRepurpose UI | Integrated app shell under toolars |
| SEO surface | Calculator-only source site | Calculator + AI tools + blog architecture |
| Monetization clarity | Split | Free calculators + subscription AI/Pro tools |

## Stakeholders

- Users: fast access to free calculators and AI tools.
- Product owner: a single commercial overseas site with monetization paths.
- Engineering: clear architecture, migration plan, and testable task sequence.
- SEO/content: crawlable English-first calculator/category/blog pages.
- Design: one system based on `design/DESIGN.md`.

## Evidence

- `design/DESIGN.md` exists and defines v1 design handoff.
- `.cdc/CONTEXT.md` and `.cdc/ARCHITECTURE.md` define current repo facts.
- `docs/product/PRD.md` defines product requirements.
- `docs/architecture/TECHNICAL-ARCHITECTURE.md` defines target architecture.

