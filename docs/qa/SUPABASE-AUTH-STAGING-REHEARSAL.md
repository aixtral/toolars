# Supabase Auth Staging Rehearsal

Status: harness ready; real staging run pending credentials  
Updated: 2026-06-09  
CDC change: `supabase-auth-staging-rehearsal`
Draft PR: [#20](https://github.com/aixtral/toolars/pull/20)

## Purpose

This rehearsal proves the production auth path after the code-level Supabase
session handoff:

1. Anonymous `/app/repurpose` requests redirect to `/login`.
2. A real Supabase test account can sign in through `/login`.
3. Supabase browser auth writes session cookies.
4. `/app/**` proxy accepts the verified cookie.
5. `/app/repurpose` renders the AI workspace without `?preview=`.

## Required Environment

Do not commit these values.

```bash
export TOOLARS_RUN_STAGING_AUTH_REHEARSAL=true
export TOOLARS_STAGING_BASE_URL="https://staging.example.com"
export TOOLARS_STAGING_TEST_EMAIL="rehearsal-user@example.com"
export TOOLARS_STAGING_TEST_PASSWORD="..."
```

The deployed staging environment must also have:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
```

The test user must exist in Supabase Auth and have a valid
`public.workspace_members` row. The signup trigger from
`20260606152000_auth_workspace_foundation.sql` can create this automatically for
new users.

## Command

Run from the repository root:

```bash
pnpm --dir site exec playwright test e2e/staging-auth-rehearsal.spec.ts --reporter=line
```

When `TOOLARS_RUN_STAGING_AUTH_REHEARSAL` is not `true`, the rehearsal tests
must be reported as skipped. A skipped local run means the harness is ready; it
does not mean staging auth passed.

## Pass Criteria

A real staging pass requires:

- The command exits `0`.
- The output shows both rehearsal tests passed, not skipped.
- The final page URL matches `/app/repurpose`.
- The page renders the `AI workspace header` region.
- No preview query string, preview cookie, or preview header is used.

## Failure Handling

| Symptom | Likely Cause | Action |
|---|---|---|
| Redirect stays on `/login` | Supabase sign-in failed or cookies were not written | Check test email/password and Supabase Auth settings. |
| `/app/repurpose` shows AuthGate | Workspace membership missing or service env missing | Verify `workspace_members` and `SUPABASE_SERVICE_ROLE_KEY`. |
| Proxy returns login after sign-in | Cookie domain/path or SSR cookie refresh issue | Check deployed domain, Supabase cookie settings, and proxy response headers. |
| Tests are skipped | Env flag or credentials missing | Set all required `TOOLARS_*` env vars before claiming staging pass. |

## Evidence Rule

CDC evidence may record local skipped output as `harness-ready`. Record a
`staging-pass` evidence row only when the command is run with real staging
credentials and both rehearsal tests pass.
