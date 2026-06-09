# Overview: pro-export-batch-usage-gates

This change connects Pro-only export and batch workflows to the existing
workspace subscription and usage architecture.

Capabilities:

- `pro-usage-gates`: server-owned plan and monthly usage enforcement for
  PDF/CSV exports and batch tool runs.

Primary files:

- `site/lib/plans/index.ts`
- `site/lib/usage/index.ts`
- `site/lib/usage/supabase.ts`
- `supabase/migrations/20260607133000_usage_counters.sql`
- `site/app/api/exports/csv/route.ts`
- `site/app/api/exports/pdf/route.ts`
- `site/app/api/batch/tools/route.ts`

Risk note:

- Real staging Supabase auth rehearsal remains pending because the required
  staging URL and test account are unavailable.
