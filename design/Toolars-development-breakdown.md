# Toolars development breakdown

Date: 2026-06-11
Source prototype: `/Users/stanvl/Documents/dev/ai-repo/aixtral-calm/vitalcalc/src/pages/toolars`
Design source: `/Users/stanvl/Documents/dev/ai-repo/aixtral-calm/new-design`
Alignment audit: `/Users/stanvl/Documents/dev/ai-repo/aixtral-calm/new-design/Toolars-implementation-alignment-audit.md`

## Product shape

Toolars is a full-domain mixed tool platform. It combines traditional local utilities, consent-gated AI tools, repeatable workflows, and saved collections. The current prototype is intentionally frontend-only and should be treated as a high-fidelity product model for a clean rebuild.

## High-fidelity source coverage

Use `/Users/stanvl/Documents/dev/ai-repo/aixtral-calm/new-design` as the design source of truth. The pack now contains 57 numbered PNGs plus `16-toolars-states-board.html`.

Coverage ledger: `/Users/stanvl/Documents/dev/ai-repo/aixtral-calm/new-design/Toolars-high-fidelity-coverage-review.md`.

The numbered files cover:

- Desktop and mobile for the current Toolars routes.
- Core dialogs and state board.
- PDF, AI Developer Lab, Lab workspaces, Lab detail pages, workflow variants, collections, account, billing, submit, admin, and states.

Do not create a unique handcrafted page for every Aixtral Lab long-tail tool during rebuild. Use the directory, workspace, detail, and workflow templates unless a tool graduates into a featured product surface.

## First development slices

1. Layout shell
   - Build header, command trigger, mobile drawer, global toast, and route-aware active nav.
   - Support shell variants before implementing pages: `tools`, `workflows`, `collections`, `workspace`, `billing`, `settings`, `admin`, and `none`.
   - Source model: `ToolarsShell.astro`.
   - Key states: anonymous Explore header, signed-in workspace header, Admin header, desktop shell, 390px shell, mobile drawer open, sticky header.

2. Command Center
   - Build a global command palette with search, category filters, result count, empty state, preview panel, and quick actions.
   - Data contract: command result requires `group`, `title`, `meta`, `slug`, and resolved `href`.
   - Required hooks: `data-command-center`, `data-command-search`, `data-command-filter`, `data-command-result`, `data-command-empty`.
   - Expected behavior: `Cmd/Ctrl+K` opens the dialog, query text filters results, category chips filter by group, no-match state appears without layout shift.

3. Explore home
   - Build the multi-domain discovery page with Toolars Picks, Popular tools, Popular workflows, trust modules, categories, and AI Developer Lab extension.
   - Source route: `/toolars`.
   - Key data: `featuredTools`, `popularWorkflows`, `toolarsCollections`.

4. Domain directories
   - Build directory pages for PDF and AI Developer Lab first.
   - PDF route: `/toolars/explore/pdf`.
   - AI Lab route: `/toolars/explore/ai-developer`.
   - PDF required modules: `Explore / PDF` breadcrumb, search/sort row, PDF subcategory tabs, Featured workflows, 10+ result cards, Recommended path, trust panel.
   - Required interactions: filter chips, visible result count, cards linking to implemented workspaces.

5. Workspace template
   - Build the three-column workbench pattern for tools that need input, output, and operational guidance.
   - Current examples: PDF Toolkit, JSON Repair, Prompt Injection Scanner, LLM Cost Calculator, MCP Server Builder.
   - PDF Toolkit is the reference high-fidelity workbench: left workspace nav, Traditional Tool / AI Enhance / Workflow Builder modes, Add files, Result, AI Enhance, Next steps, and trust strip.
   - Required parts for other workspaces: left context panel, main work surface, right next-step panel, run/calculate/export action, output state.
   - Future polish: define a dedicated AI Developer Lab workbench shell if code/security/cost/MCP tools need stronger differentiation than the generic three-column pattern.

6. Tool detail template
   - Build public listing pages for each tool, separate from workspaces.
   - Current examples: PDF Toolkit details, JSON Repair details, Prompt Injection Scanner details.
   - Required parts: overview, metrics, how it works, privacy/data handling, implementation handoff, related tools, collections, open workspace CTA.
   - Required hook: `data-tool-detail="{slug}"`.

7. Workflow builder template
   - Build route-level workflow builders for multi-tool jobs.
   - Current examples: PDF Summary, AI Prompt Hardening, LLM Cost Review, MCP Tool Launch.
   - Required parts: workflow context, step canvas, run preview, progress, output summary, tool chain, consent gate when AI is involved.

8. Collections
   - Build collection index and detail pages for repeated work.
   - Current examples: PDF Ops Kit and AI Developer Lab.
   - Required parts: recommended path, tools in collection, included workflows, notes, save/share actions.

9. Account and monetization
   - Build My Tools, Settings, Billing, Pricing, Submit Tool, and Admin Review.
   - These pages model dashboard, billing, submission, and moderation behavior without backend state.

10. States and overlays
    - Build empty, loading, error, offline, validation, toast, delete confirmation, AI consent, share, save collection, sign-in, upgrade, and command states.
    - Route: `/toolars/states`.

## Component inventory

| Component | Responsibility | Current source |
| --- | --- | --- |
| `ToolarsShell` | Header, shell variants, sidebar, mobile drawer, nav, global dialogs slot | `src/components/toolars/ToolarsShell.astro` |
| `ToolarsDialogs` | Command Center, AI consent, share, save, sign-in, upgrade, delete, toast | `src/components/toolars/ToolarsDialogs.astro` |
| Tool card | Repeated tool summary card with badges and route | Inline in Explore/directories |
| Resource row | Compact link/list row for tools, collections, workflows | Shared class `.tl-resource-row` |
| Step row | Workflow and onboarding steps | Shared class `.tl-step` |
| PDF workspace shell | High-fidelity PDF workbench shell with workspace nav and three work zones | `src/pages/toolars/tools/pdf-toolkit.astro`, `.tl-pdf-workspace-shell` |
| Workspace shell | Generic three-column tool layout for Lab tools | Shared class `.tl-workspace-layout` |
| Detail page template | Public listing and implementation handoff | PDF/JSON/Prompt/LLM Cost/MCP detail routes |
| State board | Verification surface for non-happy states | `/toolars/states` |

## Data model handoff

Start with `src/data/toolars.ts`, then split into backend-friendly tables or collections:

- `tools`: slug, name, description, category, group, type, processing modes, pricing, tags, accent, featured.
- `workflows`: slug, title, description, category, ordered steps, AI requirement, local step count, estimated time, run count.
- `collections`: slug, title, description, curator, visibility, tool slugs, workflow slugs, tags, updated date.
- `pricingPlans`: plan name, monthly/yearly price, limits, features, highlight state.
- `submissions`: review queue data for admin moderation.
- `states`: canonical UI states and recovery copy.
- `commandResults`: global search/command result projections.

## Interaction contracts

- Local tools should visibly default to local processing.
- AI actions must open AI consent before sending content to a model provider.
- Public listing pages and workspace pages must remain separate: `/tools/:slug/about` for listing, `/tools/:slug` for operating the tool.
- Sidebar context must match the page family; do not reuse the tool-category sidebar on workflow, collection, billing, settings, admin, submit, or state-board routes.
- Run buttons should update progress and output state, even in prototype.
- Save/share/sign-in/upgrade/delete actions should trigger their global dialog or toast.
- Mobile pages must keep `documentElement.scrollWidth` equal to viewport width at 390px.
- Long badges, buttons, and rows must wrap instead of clipping.
- Pricing comparison and Admin review tables should become stacked cards on mobile in the production rebuild; the current high-fidelity model keeps page-level overflow clean but still has contained table regions lower on those pages.

## Build order after prototype approval

1. Build typed data contracts and route registry.
2. Implement shell, navigation, dialogs, and Command Center.
3. Implement Explore, PDF directory, AI Developer Lab directory.
4. Implement workspace template and first five workspaces.
5. Implement tool detail template and convert all featured tools to listing pages.
6. Implement workflow builder template and collection detail template.
7. Implement account, billing, submit, admin, and state routes.
8. Add backend persistence, auth, billing provider, AI provider routing, and audit logging.

## QA gates

- Structure verification: `node scripts/verify-toolars-prototype.mjs`.
- Build verification: `npm run build`.
- Browser verification: desktop route load, command search/filter, workspace run states, collection/detail links.
- Mobile verification: 390px no horizontal overflow and no element-level text clipping.
- Design QA report: `vitalcalc/design-qa.md` must say `final result: passed`.
- High-fidelity coverage report: `Toolars-high-fidelity-coverage-review.md` must map every implemented Toolars route to a numbered static design file or a named template.
