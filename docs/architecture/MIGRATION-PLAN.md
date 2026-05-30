# toolars Migration Plan

Status: approved direction  
Source projects:

- `/Users/stanvl/Documents/dev/ai-repo/aixtral-labs`
- `/Users/stanvl/Documents/dev/ai-repo/aixtral-calm/vitalcalc`

## 1. Strategy

Create `toolars` as the new main repository. Do not merge the old projects
wholesale. Use them as source inventories:

- Migrate AI SaaS capabilities, schemas, prompt concepts, and flow behavior from
  `aixtral-labs`.
- Migrate calculator list, formula logic, SEO/content structure, blog topics,
  and multilingual route knowledge from `aixtral-calm/vitalcalc`.
- Rebuild UI using `design/DESIGN.md`.

## 2. Migration Rules

- No old UI components should be copied directly into the final product.
- Calculator formulas should be ported into pure TypeScript modules with tests.
- Tool/page metadata should be normalized into registries.
- English public copy should be reviewed/reworked rather than translated from
  the current Chinese-first pages.
- i18n architecture should be built in v1, but non-English content migration is
  phase two.

## 3. Phases

### Phase 0: Repo Foundation

- Initialize git.
- Establish `site/`, `docs/`, `design/`, `.cdc/`, `specs/`.
- Add AGENTS/CLAUDE project instructions.
- Create product, design, architecture, migration, QA docs.

### Phase 1: Next.js Foundation

- Create Next.js App Router app in `site/`.
- Configure TypeScript, Tailwind, shadcn-style UI primitives.
- Add toolars tokens and base layout.
- Add test stack and CI-ready scripts.

### Phase 2: Registry And Public Shell

- Build `ToolRegistry`.
- Build search index.
- Build header, mega menu, command palette, mobile drawer.
- Implement home utility dashboard.
- Implement all tools directory and category pages.

### Phase 3: Calculator Migration

- Create `CalculatorDefinition` schema.
- Port all 73 calculators into route metadata.
- Port formula logic into pure modules.
- Build shared calculator template.
- Add unit tests per calculator family and high-risk calculators.
- Add save/compare/share local flows.

### Phase 4: AI SaaS Migration

- Implement app shell.
- Port AI platform/tone/template concepts.
- Implement repurpose dashboard and streaming output.
- Implement brand voice, templates, history, analytics, settings.
- Integrate account, subscription, usage limits.

### Phase 5: Monetization

- Implement Free/Pro/Team pricing.
- Add Lemon Squeezy billing.
- Add Pro exports and cross-device sync.
- Add upgrade prompts only where they do not block free calculator use.

### Phase 6: Content And SEO

- Rework English-first copy.
- Add blog index and article template.
- Add schema helpers.
- Add metadata/hreflang architecture.
- Validate crawlability.

### Phase 7: QA And Release Readiness

- Run unit, component, E2E, accessibility, SEO, and visual checks.
- Security review AI/account/billing.
- Performance review public pages.
- Ship preview before release.

## 4. One-Shot Scope Constraint

v1 release scope includes all 73 calculators and all AI SaaS pages. Phasing is
for implementation order, not for reducing release scope.

## 5. Migration Acceptance

- Every calculator from VitalCalc is mapped to a toolars slug and route.
- Every current AI SaaS page from XtralRepurpose has a toolars equivalent.
- All public UI follows toolars design system.
- Old projects can be referenced for logic/content but are no longer runtime
  dependencies.

