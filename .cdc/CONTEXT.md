# toolars · CDC CONTEXT

> Initialized by CDC on 2026-05-30.
> Next rescan recommendation: 2026-08-28.
> Schema v1.
>
> CONTEXT.md records current project facts and constraints. It complements
> [ARCHITECTURE.md](./ARCHITECTURE.md), which records structural contracts.

## Metadata

```yaml
project: toolars
last_scanned: 2026-05-30
scanner: codex + cdc-workflow context bootstrap
spec_version: v1
recheck_at: 2026-08-28
status: initialized main repository; documentation/spec phase
```

## 1. Current Repository Facts

The current `/Users/stanvl/Documents/dev/ai-repo/toolars` directory is a design handoff workspace.

Current files:

| Path | Purpose |
|---|---|
| `DESIGN.md` | Product design specification and interaction/development guidance for toolars v1.0. |
| `design/images/original_generated_files/` | 10 generated high-fidelity PNG boards/screens. |
| `design/images/extracted_tool_icons/` | 42 cropped tool icon PNG files. |
| `design/images/README.txt` | Asset export notes. |
| `docs/` | Non-design product, architecture, migration, implementation, and QA documents. |
| `site/` | Reserved root for all future Next.js App Router application code. |
| `specs/changes/merge-toolars-platform/` | CDC change proposal, requirements, design, and implementation tasks. |
| `AGENTS.md` | Project instructions for Codex/agent workflows. |
| `CLAUDE.md` | Claude-style project instructions mirroring the agent contract. |
| `.cdc/CONTEXT.md` | CDC project facts and constraints. |
| `.cdc/ARCHITECTURE.md` | CDC architecture facts and intended architecture. |

This directory is now a git repository on branch `main`.

## 2. Source Projects To Merge

The intended product combines functionality from two existing projects:

| Source project | Current role | Key facts |
|---|---|---|
| `/Users/stanvl/Documents/dev/ai-repo/aixtral-labs` | AI content repurposing SaaS | Next.js app, dashboard, auth, templates, brand voice, history, analytics, settings, pricing, multi-provider AI, 10 locales. |
| `/Users/stanvl/Documents/dev/ai-repo/aixtral-calm/vitalcalc` | Calculator/tools directory | Astro app, 73 calculator pages, health/finance categories, blog, compare saved results, favorites/recent local storage, multilingual pages. |

The new merged brand name is `toolars`.

## 3. Product Direction

Toolars is a commercial overseas independent tools website:

- AI content repurposing SaaS plus a search-first calculator/tools directory.
- The first screen should be an actual tool discovery dashboard, not a marketing-only landing page.
- Calculators should remain free and usable without signup where possible.
- AI tools require an account.
- The product should feel calm, precise, fast, trustworthy, independent, and modern.

Design reference is documented in `DESIGN.md`:

- Utility density inspired by 10015.io.
- Tool IA inspired by OmniCalculator and Calculator.net.
- Enterprise polish inspired by Stripe, Vercel, and Linear.
- Original toolars identity; do not clone any reference site.

## 4. Current Design Artifacts

`DESIGN.md` contains:

- Product positioning and brand constraints.
- Information architecture and route suggestions.
- Tool categories and all 73 calculator names.
- Color, typography, spacing, radius, shadow, z-index, breakpoint tokens.
- Tailwind/shadcn implementation guidance.
- Header, mega menu, command palette, tool card, calculator form, result panel, chart card, AI output card, auth, modal/drawer/toast/tooltip specs.
- Page specs for home, tools directory, AI tools directory, category pages, calculator detail, AI app pages, blog, compare, static/legal pages.
- Accessibility, SEO/content, data model suggestions, implementation checklist, and acceptance criteria.

Generated images currently cover design-system boards and representative screens. They do not appear to cover every individual calculator page as a separate PNG.

## 5. Known Decisions

| Area | Decision | Source |
|---|---|---|
| Brand name | `toolars` | User instruction |
| Visual direction | Search-first, utility-dense, enterprise-polished, original identity | `DESIGN.md` |
| Primary UI stack target | Tailwind + shadcn-style components | `DESIGN.md` |
| Icon style | Lucide-style outline icons plus cropped generated tool icons | `DESIGN.md`, assets |
| Calculator architecture | Central tool/calculator registry, shared calculator template | `DESIGN.md` |
| AI app architecture | Consistent app shell/sidebar, account-gated AI workflows | `DESIGN.md` |
| Accessibility floor | WCAG 2.1 AA, keyboard search/menu/modal support | `DESIGN.md` |
| SEO floor | Breadcrumbs, FAQ, HowTo/WebApplication/ItemList schema where applicable | `DESIGN.md` |

## 6. Open Decisions

The following product decisions have been confirmed by the project owner:

| Topic | Why it matters |
|---|---|
| Target implementation repo | `/Users/stanvl/Documents/dev/ai-repo/toolars` is the new main repo. |
| Git | Repository initialization is allowed and has been done. |
| Framework | Next.js App Router is the unified site/app framework. |
| v1 scope | v1 must include all 73 calculators and all AI SaaS pages. |
| Monetization | Calculators are free/no-login; AI tools are subscription-gated; cross-device save, PDF/CSV advanced export, and batch tools can be Pro. |
| Migration style | Migrate feature inventory and formula logic; rebuild UI from `design/DESIGN.md`; rewrite public copy English-first. |
| i18n | Launch English-first; preserve architecture for phase-two es/fr/zh/ja/ru/ar/pt/hi/zh-tw. |
| Design authority | `design/DESIGN.md` is source of truth; PNGs are visual references. |

## 7. Documentation Plan

Documentation set:

```text
docs/product/PRD.md
design/DESIGN-SPEC.md
docs/architecture/TECHNICAL-ARCHITECTURE.md
docs/architecture/IMPLEMENTATION-PLAN.md
docs/qa/ACCEPTANCE-CRITERIA.md
```

CDC spec:

```text
specs/changes/merge-toolars-platform/
  proposal.md
  specs/overview.md
  specs/<capability>/requirements.md
  design.md
  tasks.md
```

## 8. Verification Baseline

Current repository has no application code, package manager, tests, lint, or build command.

Available CDC evidence so far:

- `cdc-goal --goal "...toolars..." --root . --json` routes this work to Standard mode.
- `cdc-doctor --quick --repo . --json` passes.
- `cdc-doctor --context-budget --repo . --json` status is ok.
- `cdc-workflow gate --mode standard --root .` passes after context bootstrap.
- `git init` initialized this directory as the new main repo.

TDD exception for this phase: documentation and project initialization only; no production code is being changed.
