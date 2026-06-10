# Progress: customer-usage-summary-read-model

## 2026-06-10

### Completed

- Created stacked branch `feat/customer-usage-summary-read-model` from `feat/billing-checkout-portal-handoff`.
- Added pure `buildUsageSummary()` read model for plan limits, used counts, and capped remaining counts.
- Added `GET /api/usage/summary` with authenticated-session enforcement, security logging for missing sessions, and no counter mutation path.
- Updated `UsagePlanCard` to render AI generation, export, and batch run usage from `UsageSummary`.
- Updated `/app/repurpose` to server-read the current workspace usage snapshot and pass the summary into the billing card.
- Preserved public calculator isolation; no public calculator modules import account, billing, usage, or AI runtime concerns.
- Opened draft PR: https://github.com/aixtral/toolars/pull/23.

### Evidence

| Command | Result |
|---|---|
| `pnpm --dir site test -- site/lib/usage/__tests__/summary.test.ts` | passed; 52 files / 184 tests |
| `pnpm --dir site test -- site/app/api/usage/summary/route.test.ts` | passed; 53 files / 186 tests |
| `pnpm --dir site test -- site/components/billing/__tests__/billing.test.tsx site/app/app/__tests__/ai-pages.test.tsx` | passed; 53 files / 186 tests |
| `pnpm --dir site lint` | passed |
| `pnpm --dir site type-check` | passed |
| `pnpm --dir site test` | passed; 53 files / 186 tests |
| `pnpm --dir site test -- site/lib/db/__tests__/public-calculator-isolation.test.ts` | passed; 53 files / 186 tests |
| `pnpm --dir site build` | passed; 110 static pages and `/api/usage/summary` dynamic route generated |

### Notes

- `site/next-env.d.ts` was restored after `next build` rewrote the generated route type reference.
- Staging Supabase rehearsal remains intentionally skipped until real staging credentials and a test account are available.
