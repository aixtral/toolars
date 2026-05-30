# toolars Implementation Plan

Status: planning baseline  
TDD policy: production code requires failing tests first  
Root app path: `site/`

## 0. Foundation

- Initialize Next.js App Router in `site/`.
- Add TypeScript, Tailwind, UI primitives, ESLint, Prettier, Vitest,
  Playwright.
- Add design tokens from `design/DESIGN.md`.
- Add base app shell and global CSS.

Evidence:

- `pnpm lint`
- `pnpm type-check`
- `pnpm test`

## 1. Registry

- Add `ToolDefinition`.
- Add `CalculatorDefinition`.
- Add all 73 calculator entries.
- Add AI tool entries.
- Add category metadata.
- Add search index builder.

Tests:

- Registry has unique slugs.
- Every tool route is valid.
- Every calculator has fields, result labels, SEO metadata, related tools.
- Search index includes calculators, AI tools, and content records.

## 2. Public Navigation

- Header.
- Mega menu.
- Command palette.
- Mobile drawer.
- Favorites/recent local storage.

Tests:

- Cmd/Ctrl+K opens search.
- Esc closes overlays.
- Keyboard can navigate results.
- Search no-results state appears.

## 3. Public Pages

- Home utility dashboard.
- All tools directory.
- AI directory.
- Health category.
- Finance category.
- Pricing.
- Blog index/article.
- Compare.
- Static/legal pages.
- 404.

Tests:

- Core pages render.
- No login needed for public calculator discovery.
- Metadata generated for representative public pages.

## 4. Calculator Engine

- Port formulas into `lib/calculators/`.
- Add shared field parsing/validation.
- Add result formatting.
- Add chart/table helpers.

Tests:

- Pure formula unit tests.
- Edge cases for invalid ranges.
- Representative calculators from every category.

## 5. Calculator UI

- Shared calculator page template.
- Form fields.
- Result panel.
- Formula/explanation/FAQ blocks.
- Related tools.
- Save/compare/share.
- PDF/CSV Pro hooks.

Tests:

- Empty/loading/success/error states.
- Local save and compare.
- Login prompt only for account sync/Pro exports.

## 6. AI SaaS

- Auth guard.
- AI app shell.
- Repurpose dashboard.
- Streaming outputs.
- Templates.
- Brand voice manager.
- History.
- Analytics.
- Settings.

Tests:

- Unauthenticated users are redirected for app routes.
- Generation can start/cancel.
- Output copy/regenerate controls work.
- Plan limits are enforced.

## 7. Billing And Account Data

- Supabase Auth/Postgres setup.
- Lemon Squeezy integration.
- Usage counters.
- API key management.
- Subscription states.

Tests:

- Webhook signature verification.
- Row-level ownership tests.
- API key masking.
- Plan gating.

## 8. i18n Architecture

- English default routes/content.
- Locale-aware metadata utilities.
- Future locale route strategy.
- RTL-safe layout checks.

Tests:

- English routes canonicalize correctly.
- Future locale helpers do not break default routes.

## 9. QA And Ship

- Unit tests.
- Component tests.
- E2E tests.
- Accessibility checks.
- SEO/schema validation.
- Performance smoke checks.
- CDC ship preview.

Release evidence:

- `pnpm lint`
- `pnpm type-check`
- `pnpm test`
- `pnpm test:e2e`
- `git diff --stat`
- `cdc-workflow after-goal --change merge-toolars-platform --root .`

