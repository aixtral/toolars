# Design: auth-route-guard-implementation

## Approach

Use a Next.js 16 `site/proxy.ts` file, because this repository runs Next.js
16.2.6 and the official Next.js file convention renamed Middleware to Proxy in
v16.

Official source anchor:

- https://nextjs.org/docs/app/api-reference/file-conventions/proxy

The proxy will match `/app/:path*` only. It will not run for `/api/**`,
`/tools/**`, public marketing pages, sitemap, robots, or static assets.

## Session Inputs

Current preview inputs:

- Query preview value from `?preview=1|free|pro|team`.
- Existing route handler preview headers for API calls.

New app-route preview input:

- `toolars-preview-plan` cookie set by the proxy when a valid preview query is
  accepted in a preview-enabled environment.

Production future input:

- Real auth provider session cookie, to be added in a later Supabase/Auth pass.

## Redirect Contract

Anonymous app page requests redirect to:

```text
/login?next=<original-path-and-query>
```

Preview query redirects are not stripped; the proxy allows the request and sets
the preview cookie so sibling app navigation can work without repeating
`?preview=...` on every link.

## Risks

| Risk | Mitigation |
|---|---|
| Proxy accidentally gates public calculators | Matcher is `/app/:path*`; unit tests assert `/tools/bmi-calculator` does not match. |
| Preview cookie becomes production bypass | Reuse the same preview-auth enablement rule: production defaults to disabled unless explicitly enabled. |
| Preview nav loses plan state | Layout links can preserve `preview=1` where appropriate; proxy cookie also keeps sibling app pages accessible. |

## Verification Plan

```bash
pnpm --dir site test -- proxy
pnpm --dir site test:e2e -- auth-billing
pnpm --dir site lint
pnpm --dir site type-check
cdc-workflow gate --mode standard --root .
cdc-workflow ship-preview --change auth-route-guard-implementation --root .
```

