## 2026-06-09 18:56 +08 - harness ready verification

- Completed: `/login` now uses `SignInForm` and Supabase
  `signInWithPassword()`.
- Completed: safe `next` redirect handling moved to server-safe
  `site/lib/auth/redirect.ts` after e2e found the client/server boundary bug.
- Completed: env-gated Playwright rehearsal at
  `site/e2e/staging-auth-rehearsal.spec.ts`.
- Completed: QA SOP at `docs/qa/SUPABASE-AUTH-STAGING-REHEARSAL.md`.
- Verified locally: calculator isolation, lint, type-check, Vitest, build, e2e,
  and CDC gate passed; staging rehearsal command reported `2 skipped` because
  no staging credentials are configured in this shell.
- Next session start: run ship preview, push, create draft PR, then run the
  real staging rehearsal once credentials are provided.
