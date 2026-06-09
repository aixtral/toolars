# Final Production Security Audit

Status: production SaaS release blocked  
Updated: 2026-06-09  
CDC change: `final-production-security-audit`  
Scope branch: `feat/final-production-security-audit`  
Review anchor: PR #17, `feat/integrate-latest-stack-to-main`
Audit PR: [#18](https://github.com/aixtral/toolars/pull/18)

## Executive Decision

The current Toolars top stack is acceptable for continued draft-PR review and
local/staging preview. It is not acceptable for production SaaS release yet.

Two release-risk issues were fixed in this audit pass:

- Production AI provider configuration now fails closed instead of falling back
  to the preview provider.
- Failed provider generations no longer increment workspace AI usage.

The remaining blocker is not a public-calculator risk. Public calculators remain
free, crawlable, and isolated from auth, AI, billing, usage, and Supabase
runtime modules. The remaining blocker is the SaaS account boundary: production
Supabase Auth/session cookies are not wired into `/app/**` and
`/api/ai/repurpose` yet, so the AI subscription product must not launch until
that handoff is implemented and rehearsed.

## Audit Commands

Commands run during this audit:

```bash
cdc-workflow gate --mode standard --root .
rg "createToolarsSupabaseServiceClient|emitSecurityEvent|TOOLARS_ENABLE_PREVIEW_AUTH|Lemon|usage_counters" site supabase -n
pnpm --dir site audit --json --registry=https://registry.npmjs.org
rg -n -i "sk-|api[_-]?key|password|secret|token|private key|BEGIN RSA|BEGIN OPENSSH" --glob '!site/node_modules/**' --glob '!site/.next/**' .
git log --all -p -G "API_KEY|SECRET|PASSWORD|TOKEN|PRIVATE_KEY|BEGIN RSA|BEGIN OPENSSH" -- .
rg -n "NEXT_PUBLIC_.*(SECRET|KEY|TOKEN|BILLING|LEMON|SERVICE)|SUPABASE_SERVICE_ROLE_KEY|TOOLARS_BILLING_WEBHOOK_SECRET|TOOLARS_AI_PROVIDER|TOOLARS_AI_DEFAULT_MODEL" site --glob '!site/node_modules/**' --glob '!site/.next/**'
rg -n "from '@/lib/(auth|billing|usage|supabase|ai|plans)'|from \"@/lib/(auth|billing|usage|supabase|ai|plans)\"" site/app/tools site/lib/calculators site/components/tools site/components/calculators
rg -n "dangerouslySetInnerHTML|eval\(|new Function|child_process|exec\(|spawn\(|fetch\(" site --glob '!site/node_modules/**' --glob '!site/.next/**'
pnpm --dir site test -- provider-config repurpose
```

Tool note: `gitleaks` is not installed in this workstation environment, so this
pass used ripgrep source scans and git-history patch scans for secret
archaeology.

## Critical

No open critical finding was found in the current top stack.

## High

### H1: Production Supabase session handoff is not wired into app/API auth

Anchors:

- `site/lib/auth/index.ts:41`
- `site/lib/auth/supabase-session.ts:51`
- `site/proxy.ts:24`
- `site/app/api/ai/repurpose/route.ts:26`
- `site/components/ai/repurpose-workspace.tsx:186`

Issue:

`resolveToolarsSessionFromSupabase()` exists, but `getSessionFromRequest()`
still derives API sessions from preview headers only. In production,
`isPreviewAuthAllowed()` returns false, so `/api/ai/repurpose` fails closed with
401 for all users. The `/app/**` proxy likewise supports preview cookies/query
state rather than real Supabase session cookies.

Impact:

This is safer than fail-open, but it blocks production SaaS launch. If future
work connects real AI provider credentials or billing before replacing preview
headers with Supabase session resolution, the account boundary can drift into an
unsafe state.

Required remediation:

Create `auth-session-cookie-handoff` or equivalent:

- Wire Supabase SSR session/cookie validation into `/app/**` and
  `/api/ai/repurpose`.
- Derive `userId`, `workspaceId`, `role`, and `planId` from Supabase Auth plus
  workspace/subscription data, never from client-submitted preview headers.
- Keep preview auth local/staging only.
- Add E2E coverage for anonymous, free authenticated, Pro authenticated, and
  expired subscription users.

Go/no-go:

Blocks production SaaS release. Does not block public calculator review.

## Medium

### M1: Billing webhook idempotency is based on a derived payload hash

Anchors:

- `site/lib/billing/index.ts:262`
- `site/lib/billing/index.ts:268`
- `supabase/migrations/20260607123000_billing_subscription_state.sql:17`

Issue:

`provider_event_id` is derived from provider, event name, object type, object
ID, and a payload hash prefix. This handles exact duplicate retries, but it is
not the same as storing a provider-supplied webhook event identifier if Lemon
Squeezy exposes one in the payload or headers.

Impact:

Operational replay and reconciliation are harder because the ledger cannot
answer whether a specific provider webhook ID has been processed. This is not
a current authentication bypass because unsigned webhooks are rejected, but it
is a release-readiness gap for billing operations.

Recommended remediation:

In `checkout-portal-handoff-pass` or a dedicated billing reconciliation pass,
store the canonical provider event/webhook ID when available, and keep
`payload_hash` as audit metadata rather than the primary idempotency key.

### M2: Security events are process-local and not durable

Anchors:

- `site/lib/security/events.ts:39`
- `site/lib/security/events.ts:81`
- `site/lib/security/events.ts:83`

Issue:

Security events are sanitized and useful for tests/local preview, but they are
kept in memory and emitted with `console.warn`. There is no durable audit table,
trace ID propagation, or production log sink yet.

Impact:

AI and billing abuse investigation would be incomplete in production. This
does not currently expose data because metadata is allowlisted, but it limits
incident response.

Recommended remediation:

Create `security-event-durable-audit-pass` after auth/session handoff:

- Persist security events server-side.
- Include request IDs and workspace IDs where safe.
- Keep raw source text, signatures, webhook bodies, provider keys, and customer
  emails out of logs.

### M3: AI rate limiting is preview-local, not deployment-grade

Anchors:

- `site/lib/ai/runtime-security.ts:13`
- `site/lib/ai/runtime-security.ts:41`
- `site/app/api/ai/repurpose/route.ts:102`

Issue:

The runtime request throttle is an in-memory preview map keyed by user ID. Usage
metering is durable when Supabase service env is configured, but short-window
abuse throttling is not shared across processes or deployments.

Impact:

In a multi-instance production deployment, users could bypass short-window rate
limits by hitting different instances. Plan limits still protect monthly usage,
but provider-cost spikes remain possible.

Recommended remediation:

Add a durable or edge-compatible rate limiter keyed by user/workspace/IP before
real provider launch.

## Low

### L1: Security-event metadata includes pseudonymous user IDs

Anchors:

- `site/lib/security/events.ts:26`
- `site/lib/security/events.ts:36`
- `site/app/api/ai/repurpose/route.ts:141`

Issue:

`userId` is allowlisted in security metadata. This is useful for incident
correlation, but it is still account-identifying metadata.

Recommended remediation:

Keep user IDs out of client-visible logs. For production sinks, consider
hashing or scoping identifiers by environment if required by privacy policy.

### L2: JSON-LD uses `dangerouslySetInnerHTML`, but only with serialized static data

Anchors:

- `site/app/layout.tsx:54`
- `site/app/tools/[slug]/page.tsx:107`
- `site/app/blog/[slug]/page.tsx:66`

Issue:

The app uses `dangerouslySetInnerHTML` for JSON-LD. The data source is static
registry/content and `serializeJsonLd()` is used, so no active XSS issue was
found.

Recommended remediation:

Keep JSON-LD inputs registry/content-only. If user-generated blog/tool content
is introduced, add escaping tests before rendering JSON-LD.

## Fixed In This Pass

### F1: Production AI provider fallback no longer uses preview provider

Anchors:

- `site/lib/ai/provider-config.ts:46`
- `site/lib/ai/__tests__/provider-config.test.ts:33`

Before:

`TOOLARS_AI_PROVIDER` defaulted to preview. Production without provider env
could silently use deterministic preview output.

After:

`requireAiProviderConfig()` throws in production unless
`TOOLARS_AI_PROVIDER=ai-sdk`. The AI SDK path still requires
`TOOLARS_AI_DEFAULT_MODEL`.

Verification:

```bash
pnpm --dir site test -- provider-config repurpose
```

### F2: Failed provider generations no longer consume usage

Anchors:

- `site/app/api/ai/repurpose/route.ts:159`
- `site/app/api/ai/repurpose/route.ts:178`
- `site/app/api/ai/repurpose/route.test.ts:110`

Before:

The AI route incremented workspace usage after provider generation even when
the provider returned a failed job.

After:

The route returns 502, records a sanitized `provider_failed` security event, and
does not increment usage until the job is successful.

Verification:

```bash
pnpm --dir site test -- provider-config repurpose
```

## Dependency And Secret Evidence

### deps audit

Result:

```text
pnpm --dir site audit --json --registry=https://registry.npmjs.org
metadata.vulnerabilities: info=0 low=0 moderate=0 high=0 critical=0
```

PostCSS remains resolved through the prior remediation override; no current npm
audit advisory is open on this branch.

### secret archaeology

Source and history scans found no real private keys, bearer tokens, `sk-...`
provider keys, or production service-role values.

Observed matches were false positives:

- Test values such as `lemon_test_secret`, `service_role_secret`, and
  `publishable_test_key`.
- Environment variable names such as `SUPABASE_SERVICE_ROLE_KEY` and
  `TOOLARS_BILLING_WEBHOOK_SECRET`.
- Documentation/spec text discussing secrets.
- Historical diffs showing the previously fixed development webhook fallback.

## OWASP Notes

| Category | Current assessment |
|---|---|
| Broken Access Control | Production SaaS launch blocked until Supabase session handoff replaces preview auth. Public calculators remain isolated. |
| Cryptographic Failures | Billing HMAC uses SHA-256 and `timingSafeEqual`; no hardcoded production secret found. |
| Injection | No SQL string composition, shell execution, `eval`, or `new Function` found in app code. |
| Insecure Design | Main residual design risk is preview/local auth and rate-limit behavior not yet replaced for production. |
| Security Misconfiguration | Fixed production AI provider preview fallback in this pass. |
| Vulnerable Components | `pnpm audit` reports zero vulnerabilities. |
| Identification/Auth Failures | Supabase resolver exists but is not connected to request handlers. |
| Data Integrity | Usage increment now occurs only after successful generation; billing idempotency needs provider event ID hardening. |
| Security Logging | Logs are sanitized but not durable. |
| SSRF | No server-side URL fetch of user-submitted AI source URLs was found. |

## STRIDE Summary

| Threat | Assessment |
|---|---|
| Spoofing | Preview headers are local/staging only; production session handoff remains required. |
| Tampering | Signed billing webhooks are required; unknown variants do not grant access. |
| Repudiation | Security events exist but are not durable yet. |
| Information Disclosure | No raw webhook bodies, provider errors, source text, or secrets found in security logs. |
| Denial of Service | Body/source limits exist; short-window AI throttling needs a production-grade store. |
| Elevation of Privilege | Free users are blocked from AI generation; billing state is service-role-only. |

## Go/No-Go

Production SaaS release: No-go.

Reasons:

- High H1 remains open: production Supabase session handoff is not wired into
  app/API auth.
- Medium operational gaps remain for billing idempotency, durable security
  logging, and production-grade rate limiting.

Preview/draft PR review: Go.

Public calculator release review: Go, assuming calculator formula/source
hardening continues separately.

Recommended next CDC changes:

1. `auth-session-cookie-handoff`
2. `final-production-security-audit-followup`
3. `security-event-durable-audit-pass`
4. `checkout-portal-handoff-pass`
5. `ai-persistence-history-pass`
