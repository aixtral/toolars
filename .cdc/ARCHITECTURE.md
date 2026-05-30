# toolars · Architecture

> Initialized by CDC on 2026-05-30.
> Schema v1.
>
> ARCHITECTURE.md records current and intended structural facts for toolars.
> It complements [CONTEXT.md](./CONTEXT.md), which records product and repo facts.

## Metadata

```yaml
project: toolars
last_synced: 2026-05-30
covered_changes: []
curator: codex + cdc-workflow context bootstrap
spec_version: v1
mode: A-architect
status: intended architecture approved for documentation/spec phase
```

## 1. Current Repository Shape

The current repository is a design handoff workspace, not an implementation workspace.

```mermaid
graph TD
  repo["toolars/"]
  repo --> designMd["DESIGN.md"]
  repo --> images["design/images/"]
  repo --> cdc[".cdc/"]
  images --> generated["original_generated_files/"]
  images --> icons["extracted_tool_icons/"]
```

There is currently no `site/package.json`, `site/app/`, `site/public/`, backend
service, database schema, or test harness in this directory. Future application
code must be created under `site/`.

## 2. Intended Product Architecture

The target product merges calculator/static tool discovery with account-gated AI SaaS workflows.

```mermaid
graph TD
  browser["Browser"]
  web["toolars web app"]
  registry["Tool Registry"]
  calculators["Calculator Engine Modules"]
  ai["AI Repurpose Service"]
  auth["Auth"]
  db["Database"]
  billing["Billing"]
  content["SEO Content + Blog"]
  assets["Brand + Tool Icon Assets"]

  browser --> web
  web --> registry
  web --> calculators
  web --> content
  web --> assets
  web --> auth
  web --> ai
  ai --> db
  ai --> auth
  ai --> billing
  web --> db
```

## 3. Proposed Module Map

The approved implementation target is a Next.js App Router application under
`site/`:

```text
src/
  app/ or pages/                 route layer
  components/
    layout/                      shell, header, sidebar, footer
    navigation/                  mega menu, mobile drawer
    search/                      command palette and global search
    tools/                       tool cards, directory, category pages
    calculators/                 calculator form/result primitives
    ai/                          repurpose dashboard, output cards, platform picker
    ui/                          design-system primitives
  data/
    tools.ts                     central ToolRegistry
    calculators.ts               calculator definitions
    ai-platforms.ts              platform definitions
  lib/
    calculators/                 pure calculation functions
    seo/                         metadata and schema helpers
    formatting/                  number, currency, unit formatting
    auth/                        auth helpers
    ai/                          provider/client wrappers
```

## 4. Dependency Rules

These rules should hold regardless of final framework choice.

| From | Can Depend On | Must Not Depend On | Reason |
|---|---|---|---|
| Route layer | components, data, lib/seo | raw DB drivers inside public calculator pages | Keep public pages static/fast where possible. |
| Components | UI primitives, typed data, formatting helpers | provider SDKs, DB clients | Components stay presentational and testable. |
| Calculator UI | calculator definitions, calculator engine modules | AI service, billing | Free calculators must remain independent from account-gated AI flows. |
| Calculator engine | pure utility modules | browser DOM, React, network | Enables unit tests and deterministic calculations. |
| AI app UI | AI service client, auth state, platform config | calculator internals | Keep SaaS workflow separate from public calculators. |
| Tool registry | metadata only | executable AI/provider code | Registry remains indexable and safe to render publicly. |
| SEO/content helpers | tool registry, page metadata | account state | Crawlable pages must not depend on user session. |

## 5. Cross-Module Contracts To Define

| Contract | Producer | Consumers | Status |
|---|---|---|---|
| `ToolDefinition` | data registry | home, directory, category pages, search, related tools | Suggested in `DESIGN.md`; needs final schema. |
| `CalculatorDefinition` | calculator registry | shared calculator template, validation, SEO, tests | Suggested in `DESIGN.md`; needs final schema. |
| Calculator result shape | calculator engine | result panel, compare/save/share, exports | Open. |
| Search index shape | tool/content registry | command palette, global search, mega menu | Open. |
| AI repurpose job shape | AI service | dashboard, history, analytics | Suggested in `DESIGN.md`; must align with chosen backend. |
| Anonymous local state | browser storage | favorites, recent tools, saved calculator results | Open account-sync boundary. |
| Account state | auth + DB | AI history, brand voices, settings, billing | Open provider/schema choice. |

## 6. Technology Choices

| Layer | Approved choice | Rationale |
|---|---|---|
| Web framework | Next.js App Router | Unified public SEO pages, AI streaming, route handlers, and SaaS app. |
| Language | TypeScript | Typed registries, calculator definitions, and API contracts. |
| Styling | Tailwind CSS + shadcn-style primitives | Matches `design/DESIGN.md`. |
| Auth/DB | Supabase Auth + Postgres | Aligns with source AI SaaS project and account data needs. |
| AI | Vercel AI SDK provider adapters | Fits streaming, multi-provider AI workflows. |
| Billing | Lemon Squeezy | Existing source-project direction and indie SaaS fit. |
| Tests | Vitest + Testing Library + Playwright | Unit, component, and E2E gates. |

## 7. Data Architecture Questions

The product likely needs separate persistence tiers:

- Local browser storage for anonymous calculator favorites, recent tools, and saved comparisons.
- Account database for AI users, brand voices, AI history, usage, settings, API keys, subscription state.
- Static/content layer for calculator definitions, blog content, category pages, i18n dictionaries, and SEO metadata.

Open decisions:

- Anonymous calculator saves are local by default; account sync is an explicit
  Pro/account action.
- All 73 calculators should be registry-driven through a shared template, with
  bespoke overrides only where the template cannot safely express the tool.
- Blog/content is file-based for v1 unless a later spec approves a CMS.
- Billing uses Lemon Squeezy unless a later spec supersedes this decision.

## 8. Observability and Quality Gates

Minimum gates before implementation can be called complete:

- Unit tests for calculator engine modules.
- Component tests for shared calculator form/result states.
- Integration tests for command palette, favorites, compare/save, and AI generation cancel/copy states.
- Accessibility checks for keyboard navigation, focus, modal/drawer/search interactions.
- SEO/schema validation for representative calculator, category, blog, and home pages.
- Performance checks for public calculator pages and search.

## 9. Known Architecture Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Trying to manually build 73 unique calculator UIs | High maintenance and inconsistent UX | Use shared templates driven by typed calculator definitions; allow overrides only when needed. |
| Mixing anonymous calculator UX with account-gated AI SaaS too early | User friction and unclear monetization | Keep calculators no-signup by default; gate only sync/export/AI/premium actions. |
| Choosing framework before deciding SEO vs SaaS priority | Rework | Confirm framework strategy before PRD/architecture finalization. |
| Generated image set is incomplete | Design ambiguity for many calculator states | Treat `DESIGN.md` as source of truth and request missing page/state designs if pixel-perfect implementation is required. |
| Importing source project tech debt wholesale | Bloated product | Use source projects as feature inventory; design new registry and shared primitives. |

## 10. Maintenance

- Update this file after framework selection and before implementation planning.
- Add ADRs for framework choice, data model, auth/billing, i18n routing, and calculator registry strategy.
- Use `cdc-workflow gate --mode standard --root .` before spec/propose and implementation phases.
