## 2026-06-09 18:29 +08 - implementation and verification

- Completed: Supabase cookie-backed request session resolution in
  `site/lib/auth/index.ts`, `site/lib/auth/supabase-session.ts`, and
  `site/lib/supabase/server.ts`.
- Completed: `/app/**` proxy allows verified Supabase-cookie requests while
  keeping preview auth local/staging only.
- Completed: `/api/ai/repurpose` accepts injectable sessions and defaults to
  the production request resolver.
- Completed: `/app/repurpose` renders from server cookies when no preview
  search param is present.
- Verified: calculator isolation grep, lint, type-check, unit tests, build,
  e2e, and CDC standard gate all passed.
- Next session start: run ship preview, push branch, and create draft PR once
  evidence/tasks/closeout are committed.
