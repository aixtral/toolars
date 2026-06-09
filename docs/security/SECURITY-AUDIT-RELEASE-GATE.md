# Security Audit: security-audit-release-gate

Status: production release blocked  
Updated: 2026-06-06  
CDC change: `security-audit-release-gate`  
Scope branch: `feat/security-audit-release-gate` based on
`feat/context-refresh-and-integration-pass`

## Executive Decision

Toolars is acceptable for preview review, public calculator QA, and continued
W2 backend design. It is not acceptable for production SaaS release yet.

Production release is blocked by account-app authorization gaps, preview-only
AI access, preview-only billing webhook shape, and one unresolved moderate
dependency advisory.

The public calculator surface is in better shape: no auth, billing, or AI import
was found in public calculator route/data/engine paths during this audit.

## Audit Commands

Commands run during this audit:

```bash
cdc-workflow gate --mode standard --root .
rg -n -i "sk-|api[_-]?key|password|secret|token|private[_-]?key|bearer|OPENAI|ANTHROPIC|SUPABASE|LEMONSQUEEZY|BILLING" site AGENTS.md CLAUDE.md docs specs .cdc -g '!site/node_modules' -g '!site/.next'
git log --all --regexp-ignore-case -G 'sk-|api[_-]?key|password|secret|token|private[_-]?key|bearer|OPENAI|ANTHROPIC|SUPABASE|LEMONSQUEEZY|BILLING' --pretty=format:'%h %s' -- .
rg -n "@/lib/(auth|billing|ai)|LEMON|BILLING|TOOLARS_ENABLE_PREVIEW_AUTH|x-toolars-preview" site/app/tools site/components/tools site/lib/calculators site/data -g '!site/node_modules' -g '!site/.next'
pnpm --dir site audit --audit-level high --registry=https://registry.npmjs.org/
pnpm --dir site audit --json --registry=https://registry.npmjs.org/
```

Notes:

- `pnpm --dir site audit --audit-level high` against the configured
  `npmmirror` registry failed because that registry does not expose the npm
  audit endpoint. The same command against `https://registry.npmjs.org/`
  completed.
- The full JSON audit exits non-zero because it reports a moderate advisory,
  not because a high or critical advisory exists.

## Critical

No current-code critical data exposure was found in this preview integration
candidate.

The production release is still blocked because the High findings below must be
fixed before real users, real provider keys, real billing state, or cross-device
account data are connected.

## High

### H1: App routes are not consistently protected by a server-side auth guard

Anchors:

- `site/app/app/templates/page.tsx:68`
- `site/app/app/brand-voice/page.tsx:40`
- `site/app/app/history/page.tsx:44`
- `site/app/app/analytics/page.tsx:31`
- `site/app/app/settings/page.tsx:49`
- `site/app/app/repurpose/page.tsx:71`
- `site/app/app/layout.tsx:7`

Issue:

Only `/app/repurpose` calls `getSessionFromSearchParams()`. The other app pages
render account, history, analytics, billing, API key, and workspace-management
screens without a session check. These pages are currently static preview UI and
are marked `robots: { index: false, follow: false }`, but they are product
surfaces that must be account-gated once real data exists.

Impact:

If production backend data is connected before a shared app guard is added,
account data and workspace controls can become publicly reachable.

Remediation:

Add production auth middleware or a shared server layout guard for `/app/**`.
Use Supabase session cookies or the approved auth provider. Keep preview query
auth disabled outside local preview. Add E2E cases proving anonymous users are
redirected or blocked for every `/app/**` route.

### H2: AI generation route depends on preview headers and has no persisted usage or rate limiting

Anchors:

- `site/app/api/ai/repurpose/route.ts:7`
- `site/app/api/ai/repurpose/route.ts:27`
- `site/app/api/ai/repurpose/route.ts:31`
- `site/components/ai/repurpose-workspace.tsx:186`
- `site/components/ai/repurpose-workspace.tsx:190`
- `site/lib/auth/index.ts:39`
- `site/lib/plans/index.ts:87`

Issue:

`POST /api/ai/repurpose` derives access from preview headers via
`getSessionFromRequest()`. The client sends `x-toolars-preview-user: true`.
Plan gating is evaluated with `usedGenerations: 0`, so usage is not persisted
or decremented. No rate limit, abuse throttle, request body size limit, or
server-side cost guard exists in this route.

Impact:

If preview auth is enabled in a deployed environment, clients can choose paid
preview plans through headers. Once real AI providers are wired in, this becomes
a cost-escalation and abuse risk.

Remediation:

Replace preview headers with authenticated server sessions. Add per-user and
per-workspace usage counters, rate limiting, request body limits, and provider
cost controls before any real AI SDK/provider call. Add tests for free-user
block, Pro usage decrement, exhausted usage, and repeated requests.

### H3: Billing webhook is preview-only and lacks production idempotency/state mutation

Anchors:

- `site/app/api/billing/webhook/route.ts:20`
- `site/app/api/billing/webhook/route.ts:22`
- `site/app/api/billing/webhook/route.ts:23`
- `site/app/api/billing/webhook/route.ts:45`
- `site/lib/billing/index.ts:22`
- `site/lib/billing/index.ts:67`

Issue:

The billing webhook route reads custom `toolars-signature` and
`toolars-timestamp` headers and parses a simplified `subscription.updated`
payload. It does not yet use Lemon Squeezy `X-Signature`, `X-Event-Name`, real
provider object IDs, idempotent `subscription_events`, or durable
`subscriptions` state.

Impact:

This route is useful as a preview signature exercise, but it cannot safely grant
or revoke paid access in production.

Remediation:

Implement the follow-up billing webhook pass from
`docs/architecture/BILLING-SUBSCRIPTION-STATE-DESIGN.md` after that stacked
design PR lands: raw body verification, Lemon Squeezy event parser,
idempotency ledger, subscription state table, status/access mapping, and replay
tests.

### H4: Production deployment can re-enable preview auth with one env flag

Anchors:

- `site/lib/auth/index.ts:25`
- `site/lib/auth/index.ts:28`
- `site/lib/auth/__tests__/auth.test.ts:40`
- `site/lib/auth/__tests__/auth.test.ts:54`

Issue:

Preview auth is correctly disabled in production by default, but
`TOOLARS_ENABLE_PREVIEW_AUTH=true` re-enables query/header sessions even when
`NODE_ENV=production`.

Impact:

A deployment misconfiguration could allow users to self-select preview plans.

Remediation:

For production release, replace this flag with an explicit non-production
preview build target, or enforce a startup/deployment check that fails if
`TOOLARS_ENABLE_PREVIEW_AUTH=true` in production. Record this in the environment
variable inventory and CI release gate.

## Medium

### M1: AI request validation has no maximum source length or body-size policy

Anchors:

- `site/lib/ai/index.ts:106`
- `site/lib/ai/index.ts:110`
- `site/lib/ai/index.ts:120`
- `site/app/api/ai/repurpose/route.ts:17`

Issue:

The route parses JSON and validates URL/text minimums, supported platforms,
tone, brand voice, and model. It does not cap `sourceValue` length, de-duplicate
platforms, or reject oversized request bodies.

Impact:

Large requests can waste CPU/memory today and can become provider-cost abuse
after real AI integration.

Remediation:

Add request body limits, a max `sourceValue` length, platform de-duplication,
and a clear 413/400 response contract.

### M2: Dependency audit reports transitive `postcss@8.4.31` moderate advisory

Anchors:

- `site/package.json:18`
- `site/pnpm-lock.yaml:2166`
- `site/pnpm-lock.yaml:4654`
- `site/pnpm-lock.yaml:4790`
- `postcss@8.4.31`
- `next@16.2.6`
- `GHSA-qx2v-qp2m-jg93`

deps audit:

`pnpm --dir site audit --json --registry=https://registry.npmjs.org/` reports:

- module: `postcss`
- installed vulnerable version: `8.4.31`
- path: `.>next>postcss`
- vulnerable versions: `<8.5.10`
- patched versions: `>=8.5.10`
- severity: `moderate`
- advisory: `GHSA-qx2v-qp2m-jg93`

Impact:

No high or critical advisory was reported, but this should remain a production
release item because Toolars renders user-facing pages and uses CSS tooling in
the app build.

Remediation:

Upgrade Next.js or apply a supported package override that resolves the
transitive `postcss` copy to `>=8.5.10`, then rerun `pnpm audit`.

### M3: No security event logging exists for AI and billing route failures

Anchors:

- `site/app/api/ai/repurpose/route.ts:8`
- `site/app/api/ai/repurpose/route.ts:24`
- `site/app/api/billing/webhook/route.ts:26`
- `site/app/api/billing/webhook/route.ts:38`
- `site/app/api/billing/webhook/route.ts:54`

Issue:

AI auth failures, plan denials, invalid billing signatures, unsupported billing
events, and missing webhook secrets are returned to the client but not logged to
an application audit/event sink.

Impact:

Abuse, replay attempts, webhook drift, or provider integration errors will be
hard to investigate after production launch.

Remediation:

Add structured server-side events with request IDs and safe metadata. Do not log
AI source text, provider secrets, full webhook payloads, or PII beyond required
account/workspace identifiers.

## Low

### L1: JSON-LD uses `dangerouslySetInnerHTML`, but current serializer escapes `<`

Anchors:

- `site/app/tools/[slug]/page.tsx:105`
- `site/app/blog/[slug]/page.tsx:66`
- `site/app/layout.tsx:54`
- `site/lib/seo/index.ts:264`

Issue:

Public SEO pages inject JSON-LD through `dangerouslySetInnerHTML`.
`serializeJsonLd()` uses `JSON.stringify(value).replace(/</g, '\\u003c')`,
which addresses the most important script-breakout character for current
registry-backed data.

Impact:

Low today because data sources are local registries and blog content, not
untrusted user input.

Remediation:

Keep JSON-LD inputs registry/content-file controlled. If user-authored content
is ever included, add a dedicated JSON-LD escaping test for `<`, `>`, `&`, and
Unicode line separators.

### L2: Public calculator local storage has no cross-device or sensitive-data boundary notice in code

Anchors:

- `site/lib/storage/index.ts:3`
- `site/lib/storage/index.ts:46`
- `site/app/tools/[slug]/page.tsx:59`

Issue:

Calculator saved results and comparisons use localStorage and cap stored items
to 20. This is acceptable for anonymous preview usage, but some health/finance
inputs may be sensitive.

Impact:

Low current risk because data stays local and no backend sync exists.

Remediation:

Before Pro cross-device sync, add explicit UX copy and account-backed privacy
handling for saved health/finance outputs.

## Accepted Preview Boundaries

These are acceptable for preview but must remain documented:

- Preview sessions fail closed in production by default:
  `site/lib/auth/index.ts:25` and `site/lib/auth/__tests__/auth.test.ts:40`.
- Billing development fallback secret is not accepted in production:
  `site/app/api/billing/webhook/route.ts:13` and
  `site/app/api/billing/webhook/route.test.ts:55`.
- Billing signatures use HMAC-SHA256 and timing-safe comparison for the preview
  route: `site/lib/billing/index.ts:43` and `site/lib/billing/index.ts:63`.
- Public calculator paths do not import auth, billing, or AI modules. The
  boundary scan returned no matches for `site/app/tools`,
  `site/components/tools`, `site/lib/calculators`, and `site/data`.
- App pages are marked noindex: `site/app/app/settings/page.tsx:5` and sibling
  app pages use the same metadata pattern.

## OWASP Review

| OWASP area | Current assessment |
|---|---|
| Broken Access Control | Blocked by H1 and H2. App routes and AI route need real server auth. |
| Cryptographic Failures | Preview billing HMAC is reasonable, but production Lemon Squeezy signature support is missing. |
| Injection | No SQL/database layer exists yet. JSON-LD serializer escapes `<`; AI text is deterministic preview output. |
| Insecure Design | Blocked by preview-only auth, AI, and billing boundaries being product-visible. |
| Security Misconfiguration | Blocked by `TOOLARS_ENABLE_PREVIEW_AUTH=true` production risk and audit registry drift. |
| Vulnerable Components | One moderate `postcss@8.4.31` advisory via `next@16.2.6`; no high/critical advisory found. |
| Identification and Authentication Failures | Blocked by absence of production auth provider/session cookies. |
| Data Integrity | Billing replay/idempotency is not implemented; production billing must add `subscription_events`. |
| Security Logging Failures | Medium finding M3. |
| SSRF | Current AI URL validation does not fetch URLs, so no SSRF path exists yet. Reassess when provider/fetch integration is added. |

## STRIDE Model

| Surface | Spoofing | Tampering | Repudiation | Information disclosure | Denial of service | Elevation of privilege |
|---|---|---|---|---|---|---|
| `/app/**` pages | High: missing shared guard | Medium: static controls now, future writes risky | Medium: no audit events | Medium now, High after DB | Low | High after backend writes |
| `/api/ai/repurpose` | High: preview headers | Medium: client-chosen plan header when preview enabled | Medium: no audit trail | Medium: AI source text not logged now | Medium: no body/rate limits | High: header-selected Pro/Team preview |
| `/api/billing/webhook` | High: preview signature shape | High: no provider event idempotency | Medium: no event ledger | Low now, Medium after payload logging | Medium: retry/replay not tracked | High if used for paid access |
| Public calculators | Low: no account dependency | Low: local-only inputs | Low | Low: local storage only | Low/Medium for extreme inputs | Low |
| Dependency supply chain | Low/Medium | Medium: transitive advisory | Low | Low | Low | Medium if vulnerable build path is exploitable |

## Secrets Archaeology

secret scan summary:

- Current tracked source grep found expected docs, tests, dummy development
  strings, and environment variable names.
- No real provider key pattern such as `sk-...`, bearer token, private key, or
  production API key was identified in tracked source during this audit.
- Git history pickaxe scan matched prior commits because they added documented
  auth/billing/env concepts and dummy test secrets. The matching commits include
  `d9d146d2 fix(security): harden preview auth and billing webhooks` and
  `16555313 feat(billing): add auth and plan gates`; no real secret value was
  identified from the audit output.

Release requirement:

- Add gitleaks or an equivalent scanner to CI before production env values are
  introduced.

## Dependency Supply Chain

deps audit summary:

- `pnpm --dir site audit --audit-level high --registry=https://registry.npmjs.org/`
  passed with exit 0.
- `pnpm --dir site audit --json --registry=https://registry.npmjs.org/`
  reported 1 moderate vulnerability and 0 high/critical vulnerabilities.
- The project registry should not depend on `npmmirror` for release audit,
  because its audit endpoint is unavailable.

Dependency follow-up:

- Resolve `postcss@8.4.31` via Next.js upgrade or package override.
- Pin the release audit command to official npm registry or another registry
  with an implemented security advisory endpoint.

## Release Gate Decision

是否阻塞合 PR: no for this documentation-only audit PR.

是否阻塞 production release: yes.

Required production follow-up changes:

1. `auth-route-guard-implementation`: real auth provider/session cookies and
   shared `/app/**` guard.
2. `ai-runtime-security-pass`: provider adapter, usage metering, rate limits,
   request limits, structured safe logging.
3. `billing-webhook-production-pass`: Lemon Squeezy `X-Signature`, event parser,
   idempotency ledger, subscription state mutation, replay tests.
4. `dependency-audit-remediation-pass`: fix `postcss@8.4.31` moderate advisory.
5. `production-env-release-gate`: fail deployment if preview auth is enabled in
   production.

