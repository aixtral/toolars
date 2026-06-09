# auth-session-cookie-handoff Specs Overview

## Capabilities

- `auth-session-cookie-handoff`: server-side Supabase cookie auth for protected
  app and AI API requests.

## Release Gate

This change closes the High H1 finding from
`docs/security/FINAL-PRODUCTION-SECURITY-AUDIT.md` only when:

- Supabase Auth cookies can produce a `ToolarsSession` for route handlers.
- `/app/**` proxy allows verified Supabase-cookie requests and redirects
  anonymous requests.
- Production never accepts preview query/cookie/header auth.
- Existing calculator isolation remains unchanged.

## Verification Anchors

- `site/lib/auth/__tests__/auth.test.ts`
- `site/lib/auth/__tests__/supabase-session.test.ts`
- `site/proxy.test.ts`
- `site/app/api/ai/repurpose/route.test.ts`
- `pnpm --dir site test -- auth supabase-session proxy repurpose`
- `pnpm --dir site lint`
- `pnpm --dir site type-check`
