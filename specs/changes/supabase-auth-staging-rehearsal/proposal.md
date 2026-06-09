# Proposal: supabase-auth-staging-rehearsal

## Business Context

The `auth-session-cookie-handoff` branch completed the code-level server-side
Supabase session handoff, but the final security audit still requires a real
Supabase Auth staging rehearsal before production SaaS launch. The current
login/register pages are preview shells and cannot yet create real Supabase
session cookies for the protected AI app.

## Problem Statement

Toolars needs a repeatable way to prove that a real Supabase-authenticated user
can sign in, receive browser/session cookies, pass the `/app/**` proxy, render
`/app/repurpose`, and hit the AI API through server-derived account context.
This cannot be truthfully marked complete without staging credentials, so the
repo needs an env-gated rehearsal harness and explicit evidence rules.

## Scope

### Includes

- Implement a real Supabase password sign-in form on `/login`.
- Preserve the `next` redirect path and keep unsafe redirect values out.
- Add an env-gated Playwright staging rehearsal for anonymous redirect and
  authenticated `/app/repurpose` access.
- Document required staging environment variables and commands.
- Record CDC evidence as "harness ready" locally and "staging pass" only when
  real credentials are supplied.

### Excludes

- Full sign-up onboarding and email confirmation UX.
- OAuth provider callbacks.
- Password reset and MFA.
- Billing checkout/portal handoff.
- Durable AI history and cross-device save.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Real auth entry | Login page is a static preview shell | Login can call Supabase Auth and set cookies |
| Rehearsal repeatability | Manual and undocumented | Env-gated Playwright rehearsal command |
| Release evidence | H1 code fixed but not rehearsed | Clear staging pass/fail evidence path |

## Stakeholders

- Users: can reach paid AI tools through real account sessions.
- Engineering: gets a repeatable release rehearsal command.
- Security: can distinguish local harness readiness from real staging proof.
- Product: can unblock the next release gate once credentials and test accounts
  are available.
