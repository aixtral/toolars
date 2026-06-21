# Toolars Current Status And Phase 4 Roadmap

版本: v0.60
日期: 2026-06-21
来源: `specs/changes/rebuild-toolars-platform/tasks.md`, `specs/changes/rebuild-toolars-platform/progress.md`, `.cdc/state/evidence.jsonl`, `design/Toolars-high-fidelity-coverage-review.md`, `sites/toolars/scripts/visual-design-pack-map.json`, latest visual capture / pixelmatch reports

## 1. Executive Status

Toolars has moved past the initial rebuild MVP. The project is now in the Phase 3 polish phase, with Phase 4 productionization underway: the shell, core surfaces, public detail templates, workflow templates, collection templates, modal system, all current source-backed VitalCalc workspaces, real local File API upload lifecycle, Command Center long-result stress state, local AI provider consent audit, anonymous workspace identity, account-bound workspace ledger contract, workspace-scoped server audit ledger / run metadata contract, signed PDF upload temp object handoff / retention sweep, signed object-access URL contract, local temp PDF object read route, temp content cleanup, object-read audit, storage failure retry UI, Privacy AI history export / deletion audit flow, dedicated AI Developer Lab workbench shell, Phase 4 usage analytics / invoice detail / provider routing / audit-trail UI modules, 57-screen design capture mapping, pixelmatch-level design-vs-implementation diff, targeted mobile collection-detail correction, first mobile public-detail / shell-header correction, native DPR=2 mobile design capture, designed public-detail mobile rhythm correction, workflow index mobile template-directory correction, collection detail mobile rhythm correction, dedicated Explore home mobile app-shell correction, AI Developer Lab public-detail mobile rhythm correction, targeted `/states` / `/collections` / `/settings` mobile plus home icon/font parity correction, second-pass home icon/font plus `/states` density correction, full 28-screen mobile under-10% max mismatch regression, second-pass mobile hotspot correction for PDF Ops Kit collection / Workflows index / PDF Toolkit public detail, third-pass mobile correction for Explore home icon assets, Collections index card density, and PDF Toolkit workspace sidebar-first mobile rail, fourth-pass mobile correction for Prompt Scanner title wrapping plus AI Developer Lab workflow edge padding, fifth-pass mobile Pricing high-fidelity content / card rhythm correction, sixth-pass mobile shell/header compact alignment plus AI Developer Lab workflow v3 rhythm correction, seventh-pass desktop hotspot correction for `/tools/pdf-toolkit`, `/`, `/workflows`, and `/explore/pdf`, first Phase 4 backend seam slice for auth context, DB-ledger persistence driver, billing account API, and PDF object-storage driver, first Phase 4 page-consumption slice that hydrates Billing settings from `/api/billing/account` and displays server auth context in Privacy & AI, account-bound workspace identity headers that now carry account email into server auth context, real Sign in modal email binding flow, identity-change refresh events, signed production session cookie contract, server-persisted session ledger with revoke/logout, server account profile store with `/api/auth/session` GET, Settings account-session hydration from `/api/auth/session`, Security settings session revoke/logout consumption, billing-provider HTTP contract, encrypted PDF temp object storage, async PDF scan worker route, AI-provider execution route with success/failure run metadata and usage analytics, mobile-28 and desktop-hotspot visual release gate configuration, Free Trial Mode paid-entry suppression, Google-only sign-in modal, Google OAuth start/callback routes, shared Google-backed Toolars session issuer, production runtime path configuration for account/auth/AI/PDF stores, non-secret `/api/system/production-health` readiness reporting, and production session secret rotation support are implemented and verified.

Current measurable status:

| Area | Status | Evidence |
| --- | --- | --- |
| CDC task checklist | 339 / 339 completed | `specs/changes/rebuild-toolars-platform/tasks.md` |
| Task sections | 154 / 154 completed | Tasks 0 through 153 |
| Dedicated tool workspaces | 91 implemented | `sites/toolars/src/app/tools/*/*workspace.tsx` |
| Generic workspace fallback | Implemented | `/tools/[slug]` covers source-backed listings without custom workspaces |
| VitalCalc public detail coverage | 86 / 86 source tools covered | `progress.md` final detail coverage slice |
| VitalCalc dedicated workspace coverage | 86 / 86 source tools covered | R71 mental-health screener slice |
| Static page generation | 219 routes/pages | Latest `pnpm build` evidence rows, including dynamic `/api/ai/consent-audit`, `/api/ai/provider-runs`, `/api/auth/session`, `/api/auth/google/start`, `/api/auth/google/callback`, `/api/billing/account`, `/api/pdf/uploads`, `/api/pdf/uploads/object`, `/api/pdf/uploads/scan`, and `/api/system/production-health` |
| Test baseline | 240 files / 646 tests passing | Latest full `pnpm test` run after v0.60 production session secret rotation |
| Design-route screenshot capture | 57 / 57 captured | `output/visual-design-pack/2026-06-19T12-24-57-062Z/visual-design-pack-report.json` |
| Pixelmatch design diff | 57 / 57 compared | `output/visual-design-diff/2026-06-19T12-36-02-551Z/visual-design-diff-report.json` |
| Targeted collection mobile correction | 2 / 2 compared | `output/visual-design-diff/2026-06-19T12-46-08-528Z/visual-design-diff-report.json` |
| Mobile public detail / shell correction | 28 / 28 compared | `output/visual-design-diff/2026-06-19T13-05-42-946Z/visual-design-diff-report.json` |
| Native DPR=2 mobile design diff | 28 / 28 compared | `output/visual-design-diff/2026-06-19T13-19-59-039Z/visual-design-diff-report.json` |
| Designed public-detail mobile rhythm | 28 / 28 compared | `output/visual-design-diff/2026-06-19T13-41-28-255Z/visual-design-diff-report.json` |
| Workflow / collection mobile correction | 28 / 28 compared | `output/visual-design-diff/2026-06-19T13-52-11-576Z/visual-design-diff-report.json` |
| Explore home mobile app-shell correction | 28 / 28 compared | `output/visual-design-diff/2026-06-19T14-36-21-057Z/visual-design-diff-report.json` |
| AI Lab public-detail mobile correction | 28 / 28 compared | `output/visual-design-diff/2026-06-19T15-01-40-624Z/visual-design-diff-report.json` |
| Home / states / collections / settings mobile correction | 4 / 4 compared | `output/visual-design-diff/2026-06-19T15-42-59-373Z/visual-design-diff-report.json` |
| Home icon/font v3 + states density v2 correction | 4 / 4 compared | `output/visual-design-diff/2026-06-19T16-03-04-581Z/visual-design-diff-report.json` |
| Full mobile under-10 regression | 28 / 28 compared | `output/visual-design-diff/2026-06-20T03-10-17-555Z/visual-design-diff-report.json` |
| Mobile hotspot second pass | 28 / 28 compared | `output/visual-design-diff/2026-06-20T03-44-34-427Z/visual-design-diff-report.json` |
| Mobile hotspot third pass | 28 / 28 compared | `output/visual-design-diff/2026-06-20T04-22-40-181Z/visual-design-diff-report.json` |
| Mobile hotspot fourth pass | 28 / 28 compared | `output/visual-design-diff/2026-06-20T05-04-56-883Z/visual-design-diff-report.json` |
| Mobile hotspot fifth pass | 28 / 28 compared | `output/visual-design-diff/2026-06-20T13-38-44-972Z/visual-design-diff-report.json` |
| Mobile hotspot sixth pass | 28 / 28 compared | `output/visual-design-diff/2026-06-20T13-51-12-883Z/visual-design-diff-report.json` |
| Desktop hotspot seventh pass | 4 / 4 compared | `output/visual-design-diff/2026-06-20T14-14-19-802Z/visual-design-diff-report.json` |
| Mobile tail guardrail check | 4 / 4 compared | `output/visual-design-diff/2026-06-20T14-25-23-055Z/visual-design-diff-report.json` |
| Phase 4 backend seam slice | 6 files / 24 tests passing | Auth resolver, AI ledger route auth context, DB-style ledger persistence driver, Billing account API, PDF object-storage driver |
| Phase 4 page-consumption slice | 2 files / 8 tests passing | Billing settings API hydration and Privacy & AI server auth-context rendering |
| Phase 4 identity header binding | 6 files / 21 tests passing | Account-bound workspace headers now include account email for server auth context |
| Phase 4 sign-in binding flow | 6 files / 23 tests passing | Core Sign in modal binds local workspace identity and PATCHes server audit ledger |
| Phase 4 identity refresh events | 6 files / 26 tests passing | Workspace identity changes refresh mounted Billing and Privacy & AI account data |
| Phase 4 signed session + billing provider contract | 5 files / 16 tests passing | HttpOnly signed session cookie, `/api/auth/session`, Sign in session endpoint, billing-provider HTTP account read |
| Phase 4 server session ledger | 8 files / 28 focused tests passing; full baseline 236 files / 630 tests passing | Server-persisted session ledger, auth context requires active ledger session, `/api/auth/session` revoke/logout clears cookie |
| Phase 4 account profile store | 9 files / 31 focused tests passing; full baseline 237 files / 633 tests passing | Server account profile store, session POST account upsert, session GET current account/session response |
| Phase 4 account settings session consumption | 5 files / 19 focused tests passing; full baseline 237 files / 635 tests passing | Account settings hydrates current account/session from `/api/auth/session`; Security settings revokes the signed session via `/api/auth/session DELETE` |
| Phase 4 Free Trial + Google auth slice | 12 files / 78 focused tests passing; full baseline 239 files / 638 tests passing | Free Trial Mode hides paid entry points / payment copy, Sign in is Google-only, Google OAuth start/callback routes issue Toolars signed sessions, `/api/auth/session` uses the shared session issuer |
| Phase 4 production runtime persistence | 5 files / 22 focused tests passing; full baseline 240 files / 643 tests passing | `TOOLARS_DATA_DIR` plus explicit store/object paths drive account, session, AI audit, and PDF temp persistence; `/api/system/production-health` reports configured/fallback/missing state without leaking paths or secrets |
| Phase 4 session secret rotation | 5 files / 17 focused tests passing; full baseline 240 files / 646 tests passing | New sessions sign with `TOOLARS_AUTH_SESSION_SECRET`; old signed cookies can verify against comma-separated `TOOLARS_AUTH_SESSION_SECRET_PREVIOUS`; `/api/system/production-health` reports rotation readiness without leaking secret values |
| Phase 4 encrypted upload store + scan worker | 2 files / 15 tests passing | Encrypted PDF object envelope, async queued scan worker, `/api/pdf/uploads/scan` |
| Phase 4 AI provider execution + usage analytics | 3 files / 12 tests passing | `/api/ai/provider-runs`, provider success/failure ledger records, persisted token/credit/cost usage summary |
| Visual release gate config | 2 files / 5 tests passing; 32 / 32 release-gate screenshots captured and compared | `output/visual-release-gate/2026-06-20T17-19-45-429Z`; mobile max 9.89% under 11.5%, desktop max 12.28% under 13.0% |

## 2. Design Status

The formal high-fidelity design pack covers the current Toolars prototype architecture. It contains 57 numbered PNG files plus `16-toolars-states-board.html`.

Completed design coverage includes:

- Explore home, PDF directory, AI Developer Lab directory.
- PDF Toolkit workspace and mobile variant.
- JSON Repair, Prompt Injection Scanner, LLM Cost Calculator, and MCP Server Builder workspaces, now wrapped in the dedicated AI Developer Lab workbench shell.
- Tool detail template and featured Lab / PDF detail pages.
- Workflow index and workflow builders.
- Collections index and collection detail.
- My Tools, Settings, Billing, Pricing, Submit Tool, Admin Review, and States Board.
- Core dialogs: Command Center, AI consent, Share, Save collection, Sign in, Upgrade, Delete confirmation, toast; shared Core action modals, settings confirmation dialogs, the PDF / workflow AI consent dialog, and the PDF Toolkit upload dialog now include focus entry, Escape close, trigger focus restoration, and explicit approval or local-only states. Command Center traps Tab focus and handles long-result stress; the PDF upload overlay now includes real File API input, local scan, server temp registration, signed object-access metadata, local temp object reads, temp content cleanup, object-read audit, storage failure retry, session retention, ready queue, delete state, and a verified 390px mobile overflow fix.
- Phase 4 page modules: Billing now includes usage analytics and invoice detail; Privacy & AI now includes provider routing matrix, consent/audit log, export, deletion audit, and AI audit trail.
- Visual verification: `visual-design-pack-map.json` maps all 57 high-fidelity PNGs to live routes and viewport sizes; `visual-diff-design-pack.mjs` creates pixelmatch diff PNGs against implementation screenshots; mobile capture now uses DPR=2 so 426px CSS viewports compare natively against 852px design PNGs, and the screenshot runner hides the Next.js dev portal so development-only overlays do not pollute design comparison.

Remaining non-blocking design gaps:

- The full Aixtral Lab source has 92 tools, but the design pack does not create a separate handcrafted screen for every long-tail tool. The intended model is template-driven: catalog card, workspace template, detail template, and workflow template.
- Team management and API keys are still prototype-grade settings surfaces; their backed roles, tokens, permissions, and audit events are Phase 4 production tasks.
- Usage analytics, invoice detail, provider routing, and audit trail now have page-level high-fidelity modules plus provider-neutral server contracts for auth session, billing provider reads, AI provider execution, and usage ledgering. v0.59 adds configured runtime paths and a non-secret production health route for local/server deployments; v0.60 adds session secret rotation readiness. They still need the chosen production database driver, object storage service, worker runtime, auth provider operations, billing provider credentials/webhooks, and deployment monitoring.
- Free Trial Mode is now the default launch posture: Pricing, Billing, workspace sidebars, public detail badges, and Sign in copy hide paid purchase prompts while preserving trial credits and Phase 2 billing seams behind a feature flag.
- Some post-action result states are verified in interactive QA rather than represented as separate numbered static PNGs.
- Pixelmatch diff is now available for the 57-screen design pack, and v0.54 adds the first release-gate wrapper for mobile 28-screen and 4 desktop hotspot thresholds. It still needs to run in CI/release automation with the dev server URL supplied.
- The latest desktop hotspot pass reduced the targeted routes without accepting mobile regressions: `/tools/pdf-toolkit` 12.54% -> 12.28%, `/` 11.50% -> 11.43%, `/workflows` 11.49% -> 11.36%, `/explore/pdf` 10.75% -> 10.74%. Mobile trials for `/settings` and `/tools/prompt-injection-scanner` showed worse pixelmatch when simple header/order changes were applied, so those visual changes were not retained.

## 3. Development Status

Completed platform foundation:

- `sites/toolars` Next.js app root with TypeScript, Vitest, app routes, global CSS tokens, and local build/test commands.
- Route-aware Toolars shell variants for public tools, workflows, collections, workspace, billing, settings, admin, and neutral pages.
- Command Center real dialog with keyboard/search/filter result flows, default 16-result stress window for broad queries, Tab focus trap, Escape / overlay close focus restoration, and mobile density constraints.
- Shared Core action modal primitive for Share, Save collection, Sign in, and Upgrade, with dialog focus lifecycle, Escape close, trigger focus restoration, and single active modal behavior.
- Google-only Sign in modal for beta accounts, pointing to `/api/auth/google/start` with the current anonymous workspace id so callback can bind the future Google account to the existing Toolars workspace ledger.
- Shared settings confirmation dialog focus hook used by Delete account, Sign out all sessions, and Disconnect app confirmation dialogs.
- Shared AI consent dialog used by PDF Toolkit and PDF Summary workflow review, with scoped data copy, provider route summary for PDF Summary, cancel / deletion copy, dialog focus lifecycle, Escape close, trigger focus restoration, and explicit approval state.
- Dedicated AI Developer Lab workbench shell for code/risk/cost/MCP tools, including provider/run/artifact metadata, compact inspector rail, and responsive mobile stacking.
- PDF Toolkit File API upload lifecycle, with Add files focus restoration, real file input, local scan pass/rejection, server temp object registration, signed PDF Summary handoff URL, signed object-access URL metadata, local temp PDF object read route, temp content cleanup, object-read audit, storage failure retry UI, PDF size-limit guidance, session retention, ready queue, local/server delete state, retention sweep deletion audit, mobile overflow constraints, and separate AI-consent boundary.
- Phase 4 AI provider routing and consent audit contract for PDF Summary, including route metadata, versioned `toolars.ai-consent-audit:v1` storage, versioned anonymous `toolars.workspace-identity:v1`, workspace/account-scoped server-side `/api/ai/consent-audit` JSON ledger/run metadata, Privacy & AI audit summary rendering after client hydration, JSON privacy log export, local audit deletion, retained server deletion audit entries, future-account binding, provider execution route, provider success/failure run outcomes, and persisted token/credit/cost usage analytics.
- Phase 4 page-level high-fidelity modules for Billing usage analytics, Billing invoice detail, Privacy & AI provider routing matrix, and Privacy & AI audit trail.
- Phase 4 page-level API consumption for Billing and Privacy & AI: Billing settings keeps the high-fidelity fallback but hydrates plan, usage, invoices, account id, billing email, and portal handoff from `/api/billing/account`; Privacy & AI displays the server auth context and persisted usage summary returned by `/api/ai/consent-audit`.
- Phase 4 account settings API consumption: Account settings hydrates the signed account/session summary from `/api/auth/session`, and Security settings revokes the current signed session through `/api/auth/session DELETE` with workspace audit headers.
- Phase 4 Free Trial Mode and auth provider slice: Pricing, Billing, workspace sidebars, public detail badges, and tool cards suppress paid-entry copy by default; `/api/auth/google/start` and `/api/auth/google/callback` implement the Google OAuth authorization-code exchange; `/api/auth/session` now delegates issuance through the shared Toolars session issuer used by Google callback.
- Phase 4 production runtime persistence bootstrap: account profiles, signed auth session ledger, AI consent/run ledger, PDF temp metadata, and encrypted PDF temp objects now honor explicit production env paths or `TOOLARS_DATA_DIR`; `/api/system/production-health` reports readiness states without returning secret values or filesystem paths.
- Phase 4 session secret rotation: new Toolars session cookies are signed with the current `TOOLARS_AUTH_SESSION_SECRET`, while existing cookies can remain valid during a rotation window through comma-separated `TOOLARS_AUTH_SESSION_SECRET_PREVIOUS`; the production-health payload exposes `sessionSecretRotation` as `configured` or `fallback` without returning secret values.
- Visual design pack automation: 57-route capture map, Playwright screenshot runner, DPR-aware mobile capture utilities, and pixelmatch design-vs-implementation diff runner.
- Typed registry for Toolars tools, workflows, collections, and public details.
- Public detail route `/tools/[slug]/about`.
- Public workspace fallback route `/tools/[slug]`.

Completed product surfaces:

- Explore home, including a dedicated high-fidelity mobile app shell for the first viewport.
- PDF directory and AI Developer Lab directory.
- Workflows index.
- Collections index.
- Collection detail template for PDF Ops Kit and AI Developer Lab.
- My Tools dashboard.
- Submit Tool.
- Pricing.
- Account, Privacy & AI, API Keys, Storage, Team, Notifications, Connected Apps, Security, and Billing settings.
- Billing usage analytics and invoice detail modules.
- Privacy & AI provider routing matrix and audit trail modules.
- Admin Review Console.
- States and overlays board.

Completed AI / PDF workspaces and workflows:

- PDF Toolkit.
- JSON Repair, in the AI Developer Lab workbench shell.
- Prompt Injection Scanner, in the AI Developer Lab workbench shell.
- LLM Cost Calculator, in the AI Developer Lab workbench shell.
- MCP Server Builder, in the AI Developer Lab workbench shell.
- PDF Summary workflow.
- AI Prompt Hardening workflow.
- LLM Cost Review workflow.
- MCP Tool Launch workflow.

Completed VitalCalc dedicated interactive workspaces:

- Mortgage Calculator.
- BMI Calculator.
- Loan Calculator.
- Pregnancy Due Date Calculator.
- Compound Interest Calculator.
- TDEE Calculator.
- BMR Calculator.
- Body Fat Calculator.
- Protein Calculator.
- Water Intake Calculator.
- Calorie Deficit.
- Macro Calculator.
- Lean Body Mass.
- Body Recomposition.
- Emergency Fund.
- Savings Goal.
- Debt Payoff.
- Retirement Calculator.
- Net Worth Calculator.
- Budget Rule.
- DTI Calculator.
- APY Calculator.
- Tip Calculator.
- Bill Split Calculator.
- Unit Converter.
- Hourly to Salary Calculator.
- Inflation Calculator.
- Habit Cost.
- Income Tax.
- Percentage Calculator.
- Discount Calculator.
- Currency Converter.
- Stock Average Calculator.
- Credit Card APR.
- Investment Fee Calculator.
- Investment Goal Calculator.
- ROI Calculator.
- Rule of 72 Calculator.
- Freelance Rate Calculator.
- Side Income Tax Calculator.
- City Cost Comparison.
- China Social Insurance Calculator.
- FIRE Calculator.
- Coast FIRE Calculator.
- Car Loan Calculator.
- Rent vs Buy Calculator.
- Home Affordability Calculator.
- Student Loan Calculator.
- Mortgage Refinance Calculator.
- Credit Score Simulator.
- Subscription Audit Calculator.
- Savings Challenge Calculator.
- Dividend Reinvestment Calculator.
- Fund SIP Calculator.
- Waist-Hip Ratio Calculator.
- Blood Pressure Calculator.
- Child Growth Calculator.
- Blood Sugar / A1C Calculator.
- Crypto Tax Calculator.
- Smoke-Free Tracker.
- Caffeine Calculator.
- Alcohol Metabolism Calculator.
- Glycemic Load Calculator.
- HOMA-IR Calculator.
- Drink Calories Calculator.
- Fiber Intake Calculator.
- 1RM Calculator.
- Running Pace Calculator.
- Ovulation Calculator.
- Creatine Calculator.
- VO2 Max Calculator.
- Heart Rate Zone Calculator.
- Testosterone Calculator.
- Intermittent Fasting Calculator.
- Sleep Calculator.
- Ideal Weight Calculator.
- Steps to Calories Calculator.
- Biological Age Calculator.
- 30-30-30 Morning Method.
- GLP-1 Eligibility Check.
- GLP-1 Nutrition Calculator.
- GAD-7 Anxiety Screening.
- PHQ-9 Depression Screening.
- PSS-10 Stress Screening.
- ADHD Adult Screener.
- Burnout Assessment.

Together with the 5 AI / PDF workspaces above, Toolars currently has 91 dedicated tool workspaces. This completes dedicated interactive workspace coverage for all 86 source-backed VitalCalc tools currently in the registry.

## 4. Verification Baseline

Latest incremental verification for v0.49:

```bash
cd sites/toolars
pnpm exec vitest run src/lib/auth/toolars-auth-context.test.ts src/lib/ai/server-consent-audit-ledger.test.ts src/app/api/ai/consent-audit/route.test.ts src/lib/tools/pdf-upload-server-store.test.ts src/lib/billing/billing-account.test.ts src/app/api/billing/account/route.test.ts
pnpm typecheck
```

Latest incremental verification for v0.50:

```bash
cd sites/toolars
pnpm exec vitest run src/app/settings/privacy-ai/privacy-ai-settings-view.test.tsx src/app/settings/billing/billing-settings-view.test.tsx
pnpm typecheck
pnpm build
```

Latest incremental verification for v0.51:

```bash
cd sites/toolars
pnpm exec vitest run src/lib/workspace/workspace-identity.test.ts src/lib/auth/toolars-auth-context.test.ts src/app/api/billing/account/route.test.ts src/app/api/ai/consent-audit/route.test.ts src/app/settings/privacy-ai/privacy-ai-settings-view.test.tsx src/app/settings/billing/billing-settings-view.test.tsx
pnpm typecheck
```

Latest incremental verification for v0.52:

```bash
cd sites/toolars
pnpm exec vitest run src/components/core/core-action-modal.test.tsx src/lib/workspace/workspace-identity.test.ts src/lib/auth/toolars-auth-context.test.ts src/app/api/ai/consent-audit/route.test.ts src/app/settings/privacy-ai/privacy-ai-settings-view.test.tsx src/app/settings/billing/billing-settings-view.test.tsx
pnpm typecheck
pnpm build
```

Latest incremental verification for v0.53:

```bash
cd sites/toolars
pnpm exec vitest run src/components/core/core-action-modal.test.tsx src/lib/workspace/workspace-identity.test.ts src/lib/auth/toolars-auth-context.test.ts src/app/api/ai/consent-audit/route.test.ts src/app/settings/billing/billing-settings-view.test.tsx src/app/settings/privacy-ai/privacy-ai-settings-view.test.tsx
pnpm typecheck
pnpm build
```

Latest incremental verification for v0.54:

```bash
cd sites/toolars
pnpm exec vitest run src/lib/auth/toolars-auth-session.test.ts src/lib/auth/toolars-auth-context.test.ts src/app/api/auth/session/route.test.ts src/components/core/core-action-modal.test.tsx
pnpm exec vitest run src/app/api/billing/account/route.test.ts
pnpm exec vitest run src/lib/tools/pdf-upload-server-store.test.ts src/app/api/pdf/uploads/route.test.ts
pnpm exec vitest run src/app/api/ai/provider-runs/route.test.ts src/app/api/ai/consent-audit/route.test.ts src/lib/ai/server-consent-audit-ledger.test.ts
pnpm exec vitest run scripts/visual-release-gate-config.test.mjs scripts/visual-design-pack-utils.test.mjs
pnpm typecheck
pnpm build
pnpm test
pnpm run visual:release-gate
```

Latest incremental verification for v0.55:

```bash
cd sites/toolars
pnpm exec vitest run src/lib/auth/toolars-auth-session-ledger.test.ts src/lib/auth/toolars-auth-context.test.ts src/app/api/auth/session/route.test.ts
pnpm exec vitest run src/app/api/billing/account/route.test.ts src/app/api/ai/provider-runs/route.test.ts src/app/api/ai/consent-audit/route.test.ts src/components/core/core-action-modal.test.tsx
pnpm typecheck
pnpm build
pnpm test
```

Latest incremental verification for v0.56:

```bash
cd sites/toolars
pnpm exec vitest run src/lib/auth/toolars-account-store.test.ts src/lib/auth/toolars-auth-session-ledger.test.ts src/lib/auth/toolars-auth-session.test.ts src/lib/auth/toolars-auth-context.test.ts src/app/api/auth/session/route.test.ts src/app/api/billing/account/route.test.ts src/app/api/ai/provider-runs/route.test.ts src/app/api/ai/consent-audit/route.test.ts src/components/core/core-action-modal.test.tsx
pnpm typecheck
pnpm build
pnpm test
```

Latest incremental verification for v0.57:

```bash
cd sites/toolars
pnpm exec vitest run src/app/settings/settings-view.test.tsx src/app/settings/security/security-settings-view.test.tsx src/app/api/auth/session/route.test.ts src/lib/auth/toolars-account-store.test.ts src/lib/auth/toolars-auth-session-ledger.test.ts
pnpm typecheck
pnpm build
pnpm test
```

Latest incremental verification for v0.58:

```bash
cd sites/toolars
pnpm exec vitest run src/components/core/core-action-modal.test.tsx src/components/shell/toolars-shell.test.tsx src/app/pricing/pricing-view.test.tsx src/app/settings/settings-view.test.tsx src/app/settings/storage/storage-settings-view.test.tsx src/app/settings/notifications/notifications-settings-view.test.tsx src/app/settings/billing/billing-settings-view.test.tsx 'src/app/tools/[slug]/about/tool-detail-view.test.tsx' 'src/app/tools/[slug]/tool-workspace-shell-view.test.tsx' src/app/api/auth/google/start/route.test.ts src/app/api/auth/google/callback/route.test.ts src/app/api/auth/session/route.test.ts
pnpm typecheck
pnpm build
pnpm test
```

Latest incremental verification for v0.59:

```bash
cd sites/toolars
pnpm exec vitest run src/lib/auth/toolars-account-store.test.ts src/lib/auth/toolars-auth-session-ledger.test.ts src/lib/ai/server-consent-audit-ledger.test.ts src/lib/tools/pdf-upload-server-store.test.ts src/app/api/system/production-health/route.test.ts
pnpm exec vitest run src/app/api/ai/provider-runs/route.test.ts src/app/api/billing/account/route.test.ts src/app/api/auth/google/callback/route.test.ts src/app/api/auth/session/route.test.ts
pnpm typecheck
pnpm build
pnpm test
```

Latest incremental verification for v0.60:

```bash
cd sites/toolars
pnpm exec vitest run src/app/api/system/production-health/route.test.ts
pnpm exec vitest run src/lib/auth/toolars-auth-session.test.ts src/app/api/auth/session/route.test.ts src/app/api/auth/google/callback/route.test.ts src/lib/auth/toolars-auth-context.test.ts
pnpm typecheck
pnpm build
pnpm test
```

Latest incremental visual verification for v0.48:

```bash
cd sites/toolars
pnpm exec vitest run src/components/shell/toolars-shell.test.tsx src/app/tools/pdf-toolkit/pdf-toolkit-workspace.test.tsx src/app/page.test.tsx src/app/workflows/workflows-index-view.test.tsx src/app/explore/pdf/page.test.tsx
pnpm exec vitest run src/components/shell/toolars-shell.test.tsx src/app/settings/settings-view.test.tsx src/app/tools/prompt-injection-scanner/prompt-injection-scanner-workspace.test.tsx
pnpm typecheck
TOOLARS_BASE_URL=http://127.0.0.1:9321 TOOLARS_VISUAL_IDS=01,02,03,05 pnpm run visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-20T14-14-12-551Z TOOLARS_PIXELMATCH_IDS=01,02,03,05 pnpm run visual:diff-design-pack
TOOLARS_BASE_URL=http://127.0.0.1:9321 TOOLARS_VISUAL_IDS=04,40,46,50 pnpm run visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-20T14-25-15-825Z TOOLARS_PIXELMATCH_IDS=04,40,46,50 pnpm run visual:diff-design-pack
```

Latest verified baseline:

```bash
cd sites/toolars
pnpm test -- billing-settings-view privacy-ai-settings-view json-repair-workspace prompt-injection-scanner-workspace llm-cost-calculator-workspace mcp-server-builder-workspace
pnpm typecheck
pnpm build
pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T12-24-57-062Z pnpm visual:diff-design-pack
TOOLARS_VISUAL_IDS=34,37 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T12-45-59-677Z TOOLARS_PIXELMATCH_IDS=34,37 pnpm visual:diff-design-pack
TOOLARS_VISUAL_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T13-04-49-763Z TOOLARS_PIXELMATCH_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:diff-design-pack
pnpm exec vitest run scripts/visual-design-pack-utils.test.mjs
TOOLARS_VISUAL_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T13-18-58-176Z TOOLARS_PIXELMATCH_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:diff-design-pack
pnpm exec vitest run 'src/app/tools/[slug]/about/tool-detail-view.test.tsx'
TOOLARS_VISUAL_IDS=49,50,51,52,57 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T13-39-56-397Z TOOLARS_PIXELMATCH_IDS=49,50,51,52,57 pnpm visual:diff-design-pack
TOOLARS_VISUAL_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T13-40-28-684Z TOOLARS_PIXELMATCH_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:diff-design-pack
pnpm exec vitest run src/app/workflows/workflows-index-view.test.tsx 'src/app/collections/[slug]/collection-detail-view.test.tsx'
TOOLARS_VISUAL_IDS=35 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T13-47-41-185Z TOOLARS_PIXELMATCH_IDS=35 pnpm visual:diff-design-pack
TOOLARS_VISUAL_IDS=34,37 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T13-50-48-231Z TOOLARS_PIXELMATCH_IDS=34,37 pnpm visual:diff-design-pack
TOOLARS_VISUAL_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T13-51-14-530Z TOOLARS_PIXELMATCH_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:diff-design-pack
pnpm exec vitest run src/app/page.test.tsx
TOOLARS_VISUAL_IDS=04 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T14-33-54-342Z TOOLARS_PIXELMATCH_IDS=04 pnpm visual:diff-design-pack
TOOLARS_VISUAL_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T14-34-59-945Z TOOLARS_PIXELMATCH_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:diff-design-pack
pnpm exec vitest run 'src/app/tools/[slug]/about/tool-detail-view.test.tsx'
TOOLARS_VISUAL_IDS=49,50,51,52 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T14-59-10-519Z TOOLARS_PIXELMATCH_IDS=49,50,51,52 pnpm visual:diff-design-pack
TOOLARS_VISUAL_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T15-00-12-100Z TOOLARS_PIXELMATCH_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:diff-design-pack
pnpm exec vitest run src/app/page.test.tsx src/app/states/states-board-view.test.tsx src/app/collections/collections-index-view.test.tsx src/app/settings/settings-view.test.tsx
TOOLARS_VISUAL_IDS=04,36,40,44 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T15-42-28-959Z TOOLARS_PIXELMATCH_IDS=04,36,40,44 pnpm visual:diff-design-pack
pnpm exec vitest run src/app/page.test.tsx src/app/states/states-board-view.test.tsx src/app/collections/collections-index-view.test.tsx src/app/settings/settings-view.test.tsx
pnpm typecheck
TOOLARS_VISUAL_IDS=04,36,40,44 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-19T16-02-57-173Z TOOLARS_PIXELMATCH_IDS=04,36,40,44 pnpm visual:diff-design-pack
pnpm exec vitest run src/app/page.test.tsx src/app/states/states-board-view.test.tsx src/app/collections/collections-index-view.test.tsx src/app/settings/settings-view.test.tsx
pnpm typecheck
TOOLARS_VISUAL_IDS=04 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-20T03-07-02-794Z TOOLARS_PIXELMATCH_IDS=04 pnpm visual:diff-design-pack
TOOLARS_VISUAL_IDS=04,36,40,44 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-20T03-08-13-769Z TOOLARS_PIXELMATCH_IDS=04,36,40,44 pnpm visual:diff-design-pack
TOOLARS_VISUAL_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:design-pack
TOOLARS_VISUAL_CAPTURE_DIR=/Users/stanvl/Documents/dev/ai-repo/toolars/output/visual-design-pack/2026-06-20T03-08-55-505Z TOOLARS_PIXELMATCH_IDS=04,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57 pnpm visual:diff-design-pack
```

Latest recorded results:

- `pnpm test -- billing-settings-view privacy-ai-settings-view json-repair-workspace prompt-injection-scanner-workspace llm-cost-calculator-workspace mcp-server-builder-workspace`: 225 files / 585 tests passed.
- `pnpm typecheck`: passed.
- `pnpm build`: passed with no Turbopack warnings and generated 213 routes/pages, including Node.js dynamic `/api/ai/consent-audit`, `/api/billing/account`, `/api/pdf/uploads`, and `/api/pdf/uploads/object`.
- `pnpm visual:design-pack`: 57 / 57 design routes captured in `output/visual-design-pack/2026-06-19T12-24-57-062Z`.
- `pnpm visual:diff-design-pack`: 57 / 57 design screenshots compared with pixelmatch in `output/visual-design-diff/2026-06-19T12-36-02-551Z`; average mismatch 9.22%, max mismatch 18.01% on `/collections/ai-developer-lab` mobile.
- Targeted collection-detail mobile correction: `TOOLARS_VISUAL_IDS=34,37 pnpm visual:design-pack` captured 2 / 2 screenshots in `output/visual-design-pack/2026-06-19T12-45-59-677Z`; `TOOLARS_PIXELMATCH_IDS=34,37 pnpm visual:diff-design-pack` compared 2 / 2 in `output/visual-design-diff/2026-06-19T12-46-08-528Z`.
- Targeted correction deltas: `/collections/ai-developer-lab` mobile improved from 18.01% to 15.15%; `/collections/pdf-ops-kit` mobile improved from 17.41% to 14.18%. Remaining diff is mainly global mobile shell/header density plus broader mobile typography scale.
- Mobile public-detail / shell-header correction: Toolars mobile header now uses a brand + menu first row and command row below; designed public detail pages now use design-specific display badges, PDF Toolkit `Open tool` CTA, and PDF/JSON metric labels from the high-fidelity mobile screens.
- Native DPR=2 mobile capture utility tests: `pnpm exec vitest run scripts/visual-design-pack-utils.test.mjs` passed 1 file / 2 tests; mobile capture keeps the 426 x 923 CSS viewport but writes 852 x 1846 first-viewport pixels for the design comparison.
- Latest mobile subset evidence: 28 / 28 mobile screens captured in `output/visual-design-pack/2026-06-19T13-18-58-176Z` and compared in `output/visual-design-diff/2026-06-19T13-19-59-039Z`; average mismatch improved from 11.01% to 8.90%, max mismatch improved from 16.69% to 14.01% on `/tools/mcp-server-builder/about` mobile. All 28 mobile comparisons now report `implementationResized: false`.
- Latest public-detail DPR deltas: `/tools/json-repair/about` improved from 16.20% to 13.57%, `/tools/prompt-injection-scanner/about` from 15.80% to 13.26%, `/tools/llm-cost-calculator/about` from 16.57% to 13.90%, `/tools/mcp-server-builder/about` from 16.69% to 14.01%, and `/tools/pdf-toolkit/about` from 14.89% to 12.44%. Remaining public-detail diffs are now dominated by first-viewport vertical rhythm, type density, and component spacing rather than screenshot scale normalization.
- Designed public-detail mobile rhythm correction: `pnpm exec vitest run 'src/app/tools/[slug]/about/tool-detail-view.test.tsx'` passed 38 tests after adding the high-fidelity detail hook and copy contract. Targeted 5-route mobile diff compared in `output/visual-design-diff/2026-06-19T13-40-10-720Z`; `/tools/json-repair/about` improved from 13.57% to 10.55%, `/tools/prompt-injection-scanner/about` from 13.26% to 10.70%, `/tools/llm-cost-calculator/about` from 13.90% to 10.83%, `/tools/mcp-server-builder/about` from 14.01% to 10.87%, and `/tools/pdf-toolkit/about` from 12.44% to 9.23%.
- Latest full mobile subset evidence: 28 / 28 mobile screens captured in `output/visual-design-pack/2026-06-19T13-40-28-684Z` and compared in `output/visual-design-diff/2026-06-19T13-41-28-255Z`; average mismatch improved from 8.90% to 8.37%, max mismatch is now 13.11% on `/workflows` mobile.
- Workflow index mobile template-directory correction: `pnpm exec vitest run src/app/workflows/workflows-index-view.test.tsx` passed 3 tests after adding the mobile template-directory hook, Build from scratch CTA, WF search tile, filter chips, mobile card title / metric labels, and design-matched heading. Targeted `/workflows` mobile diff improved from 13.11% to 9.29% in `output/visual-design-diff/2026-06-19T13-47-48-298Z`.
- Collection detail mobile rhythm correction: `pnpm exec vitest run 'src/app/collections/[slug]/collection-detail-view.test.tsx'` passed 3 tests after adding the designed collection hook and mobile tools-section treatment. Targeted collection diff in `output/visual-design-diff/2026-06-19T13-50-59-931Z` improved `/collections/ai-developer-lab` from 10.61% to 6.34% and `/collections/pdf-ops-kit` from 13.01% to 9.48%.
- Latest full mobile subset evidence: 28 / 28 mobile screens captured in `output/visual-design-pack/2026-06-19T13-51-14-530Z` and compared in `output/visual-design-diff/2026-06-19T13-52-11-576Z`; average mismatch improved from 8.37% to 7.95%, max mismatch is now 11.18% on `/` mobile.
- Explore home mobile app-shell correction: `pnpm exec vitest run src/app/page.test.tsx` passed 1 test after adding the high-fidelity mobile Explore structure. Targeted `/` mobile diff is 11.79% in `output/visual-design-diff/2026-06-19T14-33-56-492Z`; the remaining route-level mismatch is mainly icon-asset shape and font rasterization rather than layout order.
- Latest full mobile subset evidence: 28 / 28 mobile screens captured in `output/visual-design-pack/2026-06-19T14-34-59-945Z` and compared in `output/visual-design-diff/2026-06-19T14-36-21-057Z`; average mismatch improved from 7.95% to 7.75%. Max mismatch is now 11.79% on `/` mobile; next highest routes are the remaining AI Developer Lab public-detail screens at 10.32% to 10.65%.
- AI Developer Lab public-detail mobile rhythm correction: `pnpm exec vitest run 'src/app/tools/[slug]/about/tool-detail-view.test.tsx'` passed 39 tests after adding the `data-ai-lab-detail` hook for JSON Repair, Prompt Injection Scanner, LLM Cost Calculator, and MCP Server Builder. Targeted 49-52 mobile diff compared in `output/visual-design-diff/2026-06-19T14-59-18-115Z`; `/tools/json-repair/about` improved from 10.32% to 6.71%, `/tools/prompt-injection-scanner/about` from 10.47% to 6.85%, `/tools/llm-cost-calculator/about` from 10.62% to 6.92%, and `/tools/mcp-server-builder/about` from 10.65% to 6.99%.
- Latest full mobile subset evidence: 28 / 28 mobile screens captured in `output/visual-design-pack/2026-06-19T15-00-12-100Z` and compared in `output/visual-design-diff/2026-06-19T15-01-40-624Z`; average mismatch improved from 7.75% to 7.23%. Max mismatch remains 11.79% on `/` mobile; next highest routes are `/states` at 9.44%, `/collections` at 9.33%, `/settings` at 9.31%, and `/collections/pdf-ops-kit` at 9.24%.
- Home / states / collections / settings mobile correction: `pnpm exec vitest run src/app/page.test.tsx src/app/states/states-board-view.test.tsx src/app/collections/collections-index-view.test.tsx src/app/settings/settings-view.test.tsx` passed 4 files / 12 tests after adding the home asset-parity hook, `/states` mobile state-gallery treatment, `/collections` mobile directory cards, and `/settings` mobile account-control cards. Targeted 04/36/40/44 mobile diff compared in `output/visual-design-diff/2026-06-19T15-42-59-373Z`; average mismatch improved from 8.94% to 8.75%, max mismatch improved from 11.79% to 11.01% on `/` mobile. Route deltas: `/` 11.79% -> 11.01%, `/collections` 9.33% -> 7.51%, `/settings` 9.31% -> 7.24%, `/states` 9.44% -> 9.22%.
- Home icon/font v3 plus states density v2 correction: `pnpm exec vitest run src/app/page.test.tsx src/app/states/states-board-view.test.tsx src/app/collections/collections-index-view.test.tsx src/app/settings/settings-view.test.tsx` passed 4 files / 12 tests, and `pnpm typecheck` passed. Targeted 04/36/40/44 mobile diff compared in `output/visual-design-diff/2026-06-19T16-03-04-581Z`; average mismatch improved from 8.75% to 8.07%, max mismatch improved from 11.01% to 10.66% on `/` mobile. Route deltas: `/` 11.01% -> 10.66%, `/states` 9.22% -> 6.87%; `/collections` remains 7.51% and `/settings` remains 7.24%.
- Home icon/font v4 and full mobile under-10 regression: `pnpm exec vitest run src/app/page.test.tsx src/app/states/states-board-view.test.tsx src/app/collections/collections-index-view.test.tsx src/app/settings/settings-view.test.tsx` passed 4 files / 12 tests, and `pnpm typecheck` passed. Targeted `/` mobile diff improved from 10.66% to 9.90% in `output/visual-design-diff/2026-06-20T03-07-05-261Z`; targeted 04/36/40/44 diff improved average mismatch from 8.07% to 7.88% in `output/visual-design-diff/2026-06-20T03-08-21-314Z`; full 28-screen mobile regression compared in `output/visual-design-diff/2026-06-20T03-10-17-555Z` with average mismatch 6.93% and max mismatch 9.90% on `/` mobile. Next highest mobile routes are `/collections/pdf-ops-kit` at 9.24%, `/workflows` at 9.05%, and `/tools/pdf-toolkit/about` at 9.01%.
- Mobile hotspot second pass: `pnpm exec vitest run 'src/app/collections/[slug]/collection-detail-view.test.tsx' src/app/workflows/workflows-index-view.test.tsx 'src/app/tools/[slug]/about/tool-detail-view.test.tsx'` passed 3 files / 45 tests after adding scoped mobile density hooks for PDF Ops Kit collection detail, Workflows index, and PDF Toolkit public detail. Targeted route deltas: `/collections/pdf-ops-kit` 9.24% -> 5.85%, `/workflows` 9.05% -> 6.92%, and `/tools/pdf-toolkit/about` 9.01% -> 5.28%. Full 28-screen mobile regression compared in `output/visual-design-diff/2026-06-20T03-44-34-427Z` with average mismatch 6.60% and max mismatch 9.90% on `/` mobile. The remaining primary mismatch is homepage icon/font rasterization; next highest non-home routes are `/collections` at 7.51%, `/tools/pdf-toolkit` at 7.45%, and `/tools/prompt-injection-scanner` at 7.44%.
- Mobile hotspot third pass: `pnpm exec vitest run src/app/page.test.tsx src/app/collections/collections-index-view.test.tsx src/app/tools/pdf-toolkit/pdf-toolkit-workspace.test.tsx src/app/tools/prompt-injection-scanner/prompt-injection-scanner-workspace.test.tsx` passed 4 files / 16 tests, and `pnpm typecheck` passed. Targeted route deltas: `/` 9.90% -> 9.89% with `icon-font-v5`, `/collections` 7.51% -> 6.99% after correcting mobile card CSS-pixel density, and `/tools/pdf-toolkit` 7.45% -> 6.77% after adding the sidebar-first mobile workspace rail. A prompt-scanner meta-hide experiment regressed from 7.44% to 8.02% and was reverted. Full 28-screen mobile regression captured 28 / 28 in `output/visual-design-pack/2026-06-20T04-21-03-822Z` and compared in `output/visual-design-diff/2026-06-20T04-22-40-181Z`; average mismatch improved from 6.60% to 6.56%, max mismatch improved from 9.90% to 9.89% on `/` mobile. Next highest mobile routes are `/tools/prompt-injection-scanner` at 7.44%, `/workflows/ai-prompt-hardening` at 7.40%, and `/settings` at 7.24%.
- Mobile hotspot fourth pass: `pnpm exec vitest run src/app/tools/prompt-injection-scanner/prompt-injection-scanner-workspace.test.tsx src/app/workflows/ai-prompt-hardening/ai-prompt-hardening-workflow.test.tsx src/app/workflows/llm-cost-review/llm-cost-review-workflow.test.tsx src/app/workflows/mcp-tool-launch/mcp-tool-launch-workflow.test.tsx src/app/settings/settings-view.test.tsx` passed 5 files / 16 tests, and `pnpm typecheck` passed. Targeted route deltas: `/tools/prompt-injection-scanner` 7.44% -> 7.19% after mobile title single-line correction; `/workflows/ai-prompt-hardening` 7.40% -> 7.29%, `/workflows/llm-cost-review` 7.12% -> 6.89%, and `/workflows/mcp-tool-launch` 7.09% -> 6.98% after scoped AI Lab workflow edge-padding correction. `/workflows/pdf-summary` stayed at 6.93%, proving the AI Lab rule did not leak to PDF workflows. A Settings mobile content-structure experiment regressed from 7.24% to 7.51% and was reverted. Full 28-screen mobile regression captured 28 / 28 in `output/visual-design-pack/2026-06-20T05-03-50-634Z` and compared in `output/visual-design-diff/2026-06-20T05-04-56-883Z`; average mismatch improved from 6.56% to 6.53%, max mismatch remains 9.89% on `/` mobile. Next highest mobile routes are `/workflows/ai-prompt-hardening` at 7.29%, `/settings` at 7.24%, and `/pricing` plus `/tools/prompt-injection-scanner` at 7.19%.
- Mobile hotspot fifth pass: `pnpm exec vitest run src/app/pricing/pricing-view.test.tsx` passed 1 file / 3 tests, and `pnpm typecheck` passed. Pricing now keeps the desktop high-fidelity title/CTA contract while exposing a `mixed-tools-v2` mobile copy and plan-card summary rhythm for the mobile design. Targeted route delta: `/pricing` 7.19% -> 6.36%; targeted desktop/mobile pricing capture compared 09 + 41 in `output/visual-design-diff/2026-06-20T13-37-32-601Z`. Full 28-screen mobile regression captured 28 / 28 in `output/visual-design-pack/2026-06-20T13-37-42-965Z` and compared in `output/visual-design-diff/2026-06-20T13-38-44-972Z`; average mismatch improved from 6.53% to 6.50%, max mismatch remains 9.89% on `/` mobile. Next highest mobile routes are `/workflows/ai-prompt-hardening` at 7.29%, `/settings` at 7.24%, `/tools/prompt-injection-scanner` at 7.19%, and `/collections` plus `/tools/mcp-server-builder/about` at 6.99%.
- Mobile hotspot sixth pass: `pnpm exec vitest run src/components/shell/toolars-shell.test.tsx src/app/workflows/ai-prompt-hardening/ai-prompt-hardening-workflow.test.tsx src/app/workflows/llm-cost-review/llm-cost-review-workflow.test.tsx src/app/workflows/mcp-tool-launch/mcp-tool-launch-workflow.test.tsx` first failed on the new `brand-menu-command-compact-v2` / `mobile-edge-v3` contracts, then passed 4 files / 14 tests after implementation; `pnpm typecheck` passed. Full 28-screen mobile regression captured 28 / 28 in `output/visual-design-pack/2026-06-20T13-50-16-196Z` and compared in `output/visual-design-diff/2026-06-20T13-51-12-883Z`; average mismatch improved from 6.50% to 6.41%, max mismatch remains 9.89% on `/` mobile. Route deltas include `/workflows/ai-prompt-hardening` 7.29% -> 7.14%, `/workflows/llm-cost-review` 6.89% -> 6.80%, `/settings` 7.24% -> 7.15%, `/tools/prompt-injection-scanner` 7.19% -> 7.09%, and `/pricing` 6.36% -> 6.27%.
- Latest signed upload handoff slice passed store/API/UI coverage for signed handoff URL generation, signed object URL generation, signed object content read route, temp content cleanup after user delete / expired sweep, object-read audit, HMAC tamper rejection, expiry rejection, user-requested deletion audit, expired retention sweep, ready handoff preservation after sweep, and PDF Toolkit storage failure retry.
- v0.54 productionization slice passed `pnpm test` with 235 files / 626 tests, `pnpm typecheck`, and `pnpm build` with 216 generated routes/pages. `pnpm run visual:release-gate` captured and compared 28 / 28 mobile screens plus 4 / 4 desktop hotspots in `output/visual-release-gate/2026-06-20T17-19-45-429Z`; mobile average mismatch 6.43% / max 9.89%, desktop average 11.45% / max 12.28%.
- v0.55 server session ledger slice passed focused auth/billing/provider regression with 8 files / 28 tests, full `pnpm test` with 236 files / 630 tests, `pnpm typecheck`, and `pnpm build` with 216 generated routes/pages. Signed session cookies now require an active server ledger record, update `lastSeenAt`, and can be revoked through `/api/auth/session DELETE`.
- v0.56 account profile slice passed focused auth/billing/provider regression with 9 files / 31 tests, full `pnpm test` with 237 files / 633 tests, `pnpm typecheck`, and `pnpm build` with 216 generated routes/pages. `/api/auth/session POST` now upserts a server account profile, and `/api/auth/session GET` returns the active session plus account profile as the first shared account fact source.
- v0.57 account settings session-consumption slice passed focused settings/auth regression with 5 files / 19 tests, full `pnpm test` with 237 files / 635 tests, `pnpm typecheck`, and `pnpm build` with 216 generated routes/pages. Account settings now hydrates the current account/session from `/api/auth/session`, and Security settings revokes the signed session with workspace audit headers through `/api/auth/session DELETE`.
- v0.58 Free Trial Mode and Google-only auth slice first produced the intended RED failures for paid/email UI and missing Google OAuth routes, then passed focused regression with 12 files / 78 tests, full `pnpm test` with 239 files / 638 tests, `pnpm typecheck`, and `pnpm build` with 218 generated routes/pages. Free Trial Mode hides paid entry points and purchase prompts by default, Settings/Billing/Pricing copy is beta/free-trial aligned, Sign in is Google-only, Google OAuth callback issues the shared Toolars signed session, and Phase 2 billing/provider contracts remain available behind the disabled trial flag.
- v0.59 production runtime persistence bootstrap first produced the intended RED failures for missing env-backed store paths and missing `/api/system/production-health`, then passed focused runtime persistence / health checks with 5 files / 22 tests, adjacent auth/billing/AI route regression with 4 files / 11 tests, full `pnpm test` with 240 files / 643 tests, `pnpm typecheck`, and `pnpm build` with 219 generated routes/pages and no Turbopack warnings. Account, auth-session, AI audit, PDF upload metadata, and PDF encrypted object stores now support explicit env paths or `TOOLARS_DATA_DIR`; the health route reports configured/fallback/missing state without leaking secret values or filesystem paths.
- v0.60 production session secret rotation first produced the intended RED failures for previous-secret cookie verification, explicit auth-context previous-secret propagation, and missing health readiness, then passed focused auth/health regression with 5 files / 17 tests, full `pnpm test` with 240 files / 646 tests, `pnpm typecheck`, and `pnpm build` with 219 generated routes/pages. New sessions continue to sign with the current `TOOLARS_AUTH_SESSION_SECRET`, previous comma-separated secrets can verify active ledger-backed sessions during a rotation window, and health readiness reports `sessionSecretRotation` without leaking secret values.
- Playwright browser QA passed for PDF upload handoff: `/tools/pdf-toolkit` File API upload registered a server temp object, staged UI showed `Server scan passed`, `Temporary server object`, and a `handoff_pdf-summary_*` token, then `/workflows/pdf-summary` rendered the same file and token as `Server handoff ready` with console warning/error count 0.
- HTTP smoke passed for account-bound ledger: `POST /api/ai/consent-audit` wrote workspace run metadata, `PATCH /api/ai/consent-audit` bound `acct_http_qa_123`, and account-header `GET` returned `account:acct_http_qa_123` with 1 binding and 1 run. QA runtime cache and temporary PDF were cleaned up, and the dev server was stopped.
- Production Playwright generated 375 / 768 / 1280 screenshots for the latest R71 workspace slice with no page-level horizontal overflow, no visible framework overlay, versioned localStorage save checks, and mobile screener question-row geometry assertions; latest screenshot set is `output/playwright/toolars-mental-health-*.png`.

Pixelmatch methodology:

- The diff runner reads the same 57-route manifest as the screenshot runner.
- It compares the top viewport slice of each full-page implementation screenshot to the matching design PNG.
- Mobile implementation screenshots are captured at DPR=2, so 426 x 923 CSS pixels produce an 852 x 1846 first-viewport slice that can be compared to the mobile design PNGs without resizing.
- The screenshot runner injects a visual-only style to hide `nextjs-portal`; this prevents the Next.js development indicator from being counted as a product UI mismatch.
- `pnpm run visual:release-gate` now wraps capture + pixelmatch into a release-blocking gate for mobile 28-screen and desktop hotspot subsets. Default thresholds are 11.5% mobile max mismatch and 13.0% desktop hotspot max mismatch, overridable via `TOOLARS_RELEASE_GATE_MOBILE_MAX_RATIO` and `TOOLARS_RELEASE_GATE_DESKTOP_MAX_RATIO`.

## 5. Phase 4 Roadmap: Productionization

Phase 4 starts after the current frontend-first rebuild and source-tool expansion baseline. It should be handled as new CDC changes rather than being appended informally to the completed MVP task list.

Recommended Phase 4 workstreams:

1. Auth and account persistence
   - Add real sign-in provider.
   - Persist saved tools, collections, recent runs, and user settings.
   - Keep anonymous local-first behavior as the fallback.
   - First anonymous-to-account ledger binding contract is complete.
   - v0.49 adds `ToolarsAuthContext`, so preview account headers are gated and AI audit routes expose auth metadata for future provider-backed sessions.
   - v0.50 displays the server auth context inside Privacy & AI so account-bound ledger state is visible at the page layer.
   - v0.51 sends bound account email through workspace audit and JSON headers so future-login identity can hydrate server auth context beyond account id.
   - v0.52 upgrades the Core Sign in modal from static UI to a real preview account-binding flow: email input writes local workspace identity and PATCHes the server audit ledger.
   - v0.53 adds workspace identity change events so mounted Billing and Privacy & AI pages refresh account-bound API data immediately after sign-in.
   - v0.54 replaces preview-header auth for first-party flows with a signed HttpOnly session cookie and `/api/auth/session`; Sign in now binds the local workspace and asks the server to issue a session.
   - v0.55 adds a server-side auth session ledger: signed cookies are accepted only when the session exists in the server ledger, active sessions track `lastSeenAt`, and `/api/auth/session DELETE` revokes the session and clears the cookie.
   - v0.56 adds a server account profile store: session issuance upserts normalized account profile data, and `/api/auth/session GET` returns the active account/session for future Settings, Team, API Keys, and account-menu hydration.
   - v0.57 consumes that session/profile contract in Settings: `/settings` displays the server-backed account/session summary, and `/settings/security` revokes the signed session via `/api/auth/session DELETE`.
   - v0.58 attaches the session issuer to Google-only OAuth routes: `/api/auth/google/start` creates a signed state cookie and Google authorization redirect, `/api/auth/google/callback` exchanges the code, reads Google UserInfo, binds the account to the existing workspace ledger, and issues the same Toolars signed session consumed by `/api/auth/session`.
   - v0.59 lets the account profile store and auth session ledger run from explicit env paths or `TOOLARS_DATA_DIR`, so preview JSON storage can be mounted outside `.next/cache` while the DB driver is selected.
   - v0.60 adds production session secret rotation: new cookies sign with the current secret while old active session cookies can verify against comma-separated previous secrets.
   - Next replace JSON/local session/account stores with authenticated account/workspace database storage and production auth provider session operations.

2. Billing and plans
   - First page-level high-fidelity slice is complete for Billing usage analytics and invoice detail.
   - v0.49 adds `/api/billing/account`, an authenticated billing account contract with plan, usage, invoice, and customer portal fields plus a replaceable billing driver.
   - v0.50 hydrates Billing settings from `/api/billing/account` when authenticated while preserving the high-fidelity fallback for anonymous or unavailable API states.
   - v0.54 adds the provider HTTP contract: `TOOLARS_BILLING_PROVIDER_ENDPOINT/API_KEY` lets `/api/billing/account` read customer, subscription, invoice, usage, and portal data from a configured provider; configured provider failures return 502 instead of falling back to preview state.
   - v0.58 makes Free Trial Mode the default launch posture: Pricing, Billing settings, billing shell navigation, workspace upgrade cards, PDF workspace usage card, public detail badges, and tool cards suppress paid upgrade / purchase prompts while preserving trial usage copy and keeping provider/billing tests available with the flag disabled.
   - v0.59 exposes billing-provider readiness through `/api/system/production-health`; missing billing provider config is not release-blocking while Free Trial Mode remains enabled.
   - Next bind this contract to the chosen billing provider account model, webhook verification, and invoice/portal lifecycle.
   - Connect Pricing, Upgrade, Billing settings, invoices, usage, and customer portal handoff to real plan state.
   - Preserve free local tools as a product promise.

3. AI provider routing and consent audit
   - First productionization contract complete for PDF Summary: route selection, provider summary in the consent dialog, versioned local audit persistence, anonymous workspace identity, future account binding, workspace/account-scoped JSON server ledger API, run metadata, Privacy & AI audit visibility, privacy log export, AI history deletion audit, provider routing matrix UI, and audit trail UI.
   - v0.49 adds an injectable database-style persistence driver seam around the server consent ledger while preserving the current JSON fallback.
   - v0.54 adds `/api/ai/provider-runs`, configured provider execution via `TOOLARS_AI_PROVIDER_ENDPOINT/API_KEY`, provider success/failure run records, and persisted usage analytics for tokens, credits, and cost.
   - v0.59 lets the AI consent/run ledger use `TOOLARS_AI_CONSENT_LEDGER_PATH` or `TOOLARS_DATA_DIR`, and health checks expose provider/ledger readiness without returning provider keys.
   - Next: attach a real DB driver, add provider-specific model routing, and enforce local / cloud / AI consent labels at execution boundaries.

4. File upload and storage
   - First real File API + temp object slice complete for PDF Toolkit: Add files opens a keyboard-accessible upload dialog with PDF input, local scan pass/rejection, server metadata scan, JSON temp object store, local temp content store, temp content cleanup, session retention, queue add, delete state, signed PDF Summary handoff URL, signed object-access URL metadata, `/api/pdf/uploads/object` content reads, object-read audit, retention sweep deletion audit, storage failure retry UI, and mobile overflow QA.
   - v0.49 adds an injectable object-storage driver seam around temp PDF bytes while preserving the current local file fallback.
   - v0.54 encrypts PDF temp bytes before writing to the object-storage driver/local fallback, adds queued scan mode, and exposes `/api/pdf/uploads/scan` as the first async scan worker route.
   - v0.59 lets PDF upload metadata and encrypted temp objects use `TOOLARS_PDF_UPLOAD_TEMP_STORE_PATH`, `TOOLARS_PDF_UPLOAD_OBJECT_ROOT`, or `TOOLARS_DATA_DIR`, keeping production-like local deployments out of `.next/cache`.
   - Next: connect production object storage, malware/content extraction workers, scheduled retention jobs, and storage observability.

5. Team, API, and enterprise controls
   - Usage analytics, invoice detail, provider routing, and audit trail now have the first high-fidelity page modules.
   - Turn Team, API Keys, connected apps, usage analytics, invoices, provider routing, and audit logs from prototype/UI modules into backed features.
   - Add role-based permissions and workspace-level audit trails.

6. Observability and operations
   - Add structured client/server events.
   - Track tool run success, AI consent decisions, file operation failures, and billing events.
   - Add release smoke checks for core public routes, modals, and workspace runs.
   - v0.54 promotes the first visual diff subset into `pnpm run visual:release-gate`: mobile 28-screen max 11.5% and desktop hotspots `/`, `/explore/pdf`, `/tools/pdf-toolkit`, `/workflows` max 13.0%.
   - v0.59 adds `/api/system/production-health`, a non-secret readiness endpoint for auth, persistence, providers, object encryption, and upload handoff configuration.
   - v0.60 extends production health with session secret rotation readiness, so deployments can confirm the old-secret window is configured without exposing secret material.
   - Next wire the visual release gate into CI/release automation and ratchet thresholds down as icon/font rasterization and remaining high-mismatch screens improve.

## 6. Phase 3 Status: Source Tool Depth And Polish

The source-tool depth expansion is now complete for the current VitalCalc registry: all 86 VitalCalc source tools have public details and dedicated interactive workspaces. Phase 3 polish has advanced through shared Core modals, settings confirmation dialogs, AI consent dialogs, Command Center mobile / focus-trap passes, Command Center long-result stress, the PDF Toolkit upload overlay, dedicated AI Developer Lab workbench shell, and 57-screen visual verification. Phase 4 has started with server AI audit/run metadata, account-bound anonymous ledger binding, Privacy AI export/delete audit, provider routing / audit-trail UI, billing usage / invoice UI, real File API upload lifecycle, signed PDF temp object handoff/object-access metadata, local temp object read route, temp content cleanup, object-read audit, storage retry UI, retention sweep deletion audit, runtime persistence paths, production health reporting, and session secret rotation; further work should continue backed productionization rather than adding more VitalCalc coverage.

Next recommended Phase 3 polish batches:

1. VitalCalc workspace polish
   - Audit the 86/86 dedicated workspaces for copy consistency, keyboard focus, mobile density, and repeated component opportunities.
   - Keep formula changes source-driven and add targeted tests before any behavior adjustment.

2. Modal and overlay polish
   - Settings confirmation dialogs now share the focus / Escape / trigger-restoration contract.
   - AI consent now shares the same focus / Escape / trigger-restoration contract on the PDF Toolkit and PDF Summary workflow consent entry points.
   - Command Center now traps Tab focus, restores focus on close, has a 390px mobile density QA pass, and handles broad-query long results with footer visibility.
   - PDF Toolkit now has the first future file-upload overlay lifecycle prototype plus server temp object handoff, signed object-access metadata, local temp object reads, temp content cleanup, object-read audit, and storage retry state.
   - Extend the same review to additional file-upload overlays, result-heavy search states, and backed storage error states.
   - Keep shared primitives small and covered by component-level regression tests.

3. Visual verification polish
   - First targeted pass complete for `/collections/ai-developer-lab` mobile and `/collections/pdf-ops-kit` mobile: collection hero copy now matches the high-fidelity summary, mobile tag rows/helper copy are hidden, Recommended path action is styled as a text entry, and step cards are closer to the mobile design density.
   - First public-detail / shell-header pass complete for mobile: `Menu` now shares the first header row with the brand, PDF Toolkit uses the high-fidelity `Open tool` CTA, and the designed PDF / AI Developer Lab detail badge and metric rows now match the mobile screens.
   - DPR=2 mobile screenshot support, designed public-detail mobile rhythm, workflow index mobile template-directory, collection detail mobile rhythm, Explore home mobile app-shell, AI Lab public-detail rhythm, first homepage icon/font plus `/states` / `/collections` / `/settings` mobile correction, second homepage icon/font plus `/states` density pass, full 28-screen mobile under-10 regression, second-pass hotspot correction for `/collections/pdf-ops-kit`, `/workflows`, and `/tools/pdf-toolkit/about`, third-pass `/`, `/collections`, and `/tools/pdf-toolkit` corrections, fourth-pass `/tools/prompt-injection-scanner` and AI Lab workflow corrections, fifth-pass `/pricing` mobile correction, plus sixth-pass mobile shell/header compact alignment and AI Lab workflow v3 rhythm correction are complete. Next visual work should focus on the remaining high mobile routes: homepage icon/font rasterization, `/settings`, `/tools/prompt-injection-scanner`, `/collections`, and `/tools/mcp-server-builder/about`.
   - Decide per-route thresholds before making pixelmatch a blocking release gate.
   - Re-run `pnpm visual:design-pack` and `pnpm visual:diff-design-pack` after any major layout or design-token change.

4. Mental-health and medical-sensitive QA pass
   - PHQ-9, PSS-10, ADHD, Burnout, GAD-7, GLP-1 Eligibility, GLP-1 Nutrition, and 30-30-30 now have dedicated workspaces with explicit screening / reference-only caveats.
   - A later QA pass should stress-test crisis copy, keyboard navigation, screen reader labels, and mobile select ergonomics.

5. Batch discipline
   - Keep future polish slices small so Red / Green / browser QA evidence stays reviewable.

For each batch:

- Add a new `Requirement Rxx` with one scenario per workspace plus one quality scenario.
- Add matching tasks for logic tests, UI tests, pure functions, routes, rendered QA, and evidence.
- Preserve TDD: Red first, then Green, then browser QA.
- Use existing Toolars workspace shell, local-first trust copy, Tool details handoff, and local save behavior.

## 7. Decision Rules

- Do not handcraft unique long-tail Aixtral Lab screens unless the tool graduates into a featured product surface.
- Do not duplicate old VitalCalc or Aixtral Lab UI. Reuse source formulas, logic, metadata, SEO facts, and caveats only.
- Dedicated workspaces should replace fallback only when there is real interactive value.
- Public details and workspaces stay separate: `/tools/:slug/about` for listing, `/tools/:slug` for operating the tool.
- Every completed development slice must leave evidence in `.cdc/state/evidence.jsonl` or an equivalent verification ledger.
