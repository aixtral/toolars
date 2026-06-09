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
last_scanned: 2026-06-09
scanner: codex + integrate-latest-stack-to-main
spec_version: v1
recheck_at: 2026-09-07
status: runnable Next.js implementation; top-stack integration review phase
```

## 1. Current Repository Facts

The current `/Users/stanvl/Documents/dev/ai-repo/toolars` directory is now a
runnable implementation workspace for the `toolars` unified overseas tools
site. Application code lives under `site/`; non-design docs live under `docs/`;
design artifacts live under `design/`.

Current files:

| Path | Purpose |
|---|---|
| `design/DESIGN.md` | Product design specification and interaction/development guidance for toolars v1.0. |
| `design/images/original_generated_files/` | 10 generated high-fidelity PNG boards/screens. |
| `design/images/extracted_tool_icons/` | 42 cropped tool icon PNG files. |
| `design/images/README.txt` | Asset export notes. |
| `docs/` | Non-design product, architecture, migration, implementation, and QA documents. |
| `site/` | Next.js App Router + TypeScript application code, tests, routes, components, data registry, and pure library modules. |
| `specs/changes/` | CDC change proposals, requirements, design docs, task plans, and evidence state for completed feature passes. |
| `AGENTS.md` | Project instructions for Codex/agent workflows. |
| `CLAUDE.md` | Claude-style project instructions mirroring the agent contract. |
| `.cdc/CONTEXT.md` | CDC project facts and constraints. |
| `.cdc/ARCHITECTURE.md` | CDC architecture facts and intended architecture. |

The latest top-stack implementation branch is
`feat/integrate-latest-stack-to-main`, based on
`feat/dependency-audit-remediation-pass`. `main` currently points to the
earlier `design-conformance-pass` state and should be advanced only through an
explicit integration PR review.

Current implementation snapshot as of 2026-06-09:

- Framework: Next.js App Router 16.2.6, React 19.2.4, TypeScript 5.9.3.
- Public routes include `/`, `/tools`, `/tools/[slug]`, `/ai`,
  `/categories/health`, `/categories/finance`, `/blog`, `/blog/[slug]`,
  `/pricing`, `/compare`, `/about`, `/contact`, `/privacy`, `/terms`,
  `/login`, `/register`, `/en`, `/sitemap.xml`, `/robots.txt`, and
  `/llms.txt`.
- App routes include `/app/repurpose`, `/app/templates`, `/app/brand-voice`,
  `/app/history`, `/app/analytics`, and `/app/settings`.
- Tool registry includes 73 calculator definitions plus AI SaaS tool entries.
- Calculator pages are public and no-login; basic calculation, local save,
  compare, and share flows are implemented.
- `/tools?search=<query>` now renders server-side query search results using
  the shared search helper.
- AI app pages have preview-safe UI plus route-level auth guard, production
  preview-auth release gate, request limits, structured security events,
  provider-neutral AI adapter, AI SDK wrapper, billing webhook intake, durable
  Supabase billing/usage adapters, and workspace usage gates.
- Supabase Auth/Postgres foundation exists for env/client helpers, service
  client boundary, workspace/profile SQL, and session resolution. Production
  sign-in/session-cookie rehearsal is still pending.
- Dependency audit remediation is in place for `GHSA-qx2v-qp2m-jg93`: pnpm
  override resolves PostCSS to 8.5.15 and `pnpm audit` reports zero
  vulnerabilities on the top stack.

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

## 6.1 Current Productionization Boundaries

The following boundaries are important for future planning and review:

| Area | Current state | Production next step |
|---|---|---|
| Calculator inventory | 73 routes and engines exist, with representative formula tests. | Add golden value tests and source-backed review for high-risk health/finance calculators. |
| Auth | `/app/**` route guard, production preview-auth release gate, Supabase env/client helpers, workspace SQL, and session resolver foundation exist. | Rehearse production Supabase Auth cookies/session flow and remove preview-header dependency from production paths. |
| AI generation | Deterministic preview provider plus provider-neutral adapter and AI SDK wrapper exist; AI route returns provider usage metadata. | Add real provider credentials, streaming transport, retries/backoff, cost persistence, and AI job/output history. |
| Billing | Lemon Squeezy signature parser, idempotent event model, durable Supabase `subscription_events`/`subscriptions` adapter, and runtime repository injection exist. | Add checkout/portal handoff, operational webhook replay tooling, and subscription reconciliation UI. |
| Usage metering | Workspace monthly `usage_counters`, atomic AI generation increment RPC, preview repository, Supabase adapter, and AI route plan gates exist. | Extend counters to PDF/CSV exports and batch tools; add customer-facing usage history. |
| Persistence | Anonymous calculator saves/comparisons use local storage. | Add account-backed cross-device sync for Pro workflows. |
| Observability | CDC evidence and automated tests exist. | Add application analytics/events for search, no-result queries, calculator use, AI lifecycle, and billing. |
| Security | Security audit docs, route guard, request limits, production env gate, structured security events, and dependency audit remediation exist. | Run final `cdc-role-security-audit` after top-stack integration for auth, AI, billing, secrets, and rate limits. |

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

Current site verification commands:

```bash
pnpm --dir site lint
pnpm --dir site type-check
pnpm --dir site test
pnpm --dir site test:e2e
pnpm --dir site build
cdc-workflow gate --mode standard --root .
cdc-workflow ship-preview --change <change-id> --root .
```

Latest recorded evidence on the current branch stack:

- `pnpm --dir site audit --json --registry=https://registry.npmjs.org`: zero vulnerabilities.
- `pnpm --dir site lint`: passes.
- `pnpm --dir site type-check`: passes.
- `pnpm --dir site test`: 44 test files, 147 tests passed.
- `pnpm --dir site test:e2e`: 38 Playwright tests passed.
- `pnpm --dir site build`: 104 generated pages/routes reported by Next.js build.
- `cdc-workflow gate --mode standard --root .`: passes.
- `cdc-workflow ship-preview --change dependency-audit-remediation-pass --root .`: passes.

TDD remains required for production code changes. Documentation-only context
refreshes, generated code, and configuration-only updates may declare a TDD
exception in the relevant spec closeout.
