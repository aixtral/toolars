# Proposal: final-production-security-audit

## Business Context

Toolars now has a reviewable W2 top-stack branch with public calculators,
AI SaaS preview routes, Supabase Auth/Postgres seams, provider adapters,
Lemon Squeezy webhook intake, usage metering, production env gates, and
dependency remediation. Before this stack can move toward `main` or production
credential rehearsal, the security posture needs one consolidated release
audit.

## Problem Statement

Security work has landed across multiple stacked draft PRs. The project needs a
single release-facing report that verifies the combined auth, billing, AI,
database, logging, dependency, and environment boundaries on the current top
stack. Without this pass, reviewers have to reconstruct risk from many small
PRs and may miss cross-module issues.

## Scope

### Includes

- Audit auth/session boundaries, `/app/**` guarding, preview-auth production
  behavior, and Supabase client/service-role usage.
- Audit AI repurpose route input limits, plan gates, usage metering,
  provider-adapter boundaries, and security logging.
- Audit billing webhook signature validation, idempotency, subscription
  persistence, non-sensitive logging, and runtime repository fail-closed paths.
- Audit SQL migrations for RLS posture, service-role grants, public access, and
  workspace scoping.
- Run dependency audit and secret archaeology on the current branch.
- Produce a release-facing security audit report with critical/high/low
  findings, go/no-go decision, and follow-up plan.
- Apply narrow tests/fixes only if the audit finds a release-blocking issue
  that can be remediated in this pass.

### Excludes

- Real Supabase production auth deployment.
- Real AI provider credentials or streaming transport.
- Checkout/portal implementation.
- AI job/output persistence and customer-facing usage history.
- Merging draft PRs or marking PR #17 ready.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Top-stack security decision | Spread across stacked PRs | One consolidated release audit |
| Critical/high unknowns | Not centrally recorded | Recorded with go/no-go decision |
| Dependency posture | PostCSS remediation verified | Re-verified on current audit branch |
| Secret exposure confidence | Not audited in one pass | Secret archaeology evidence recorded |

## Stakeholders

- Users: calculator users and AI SaaS users whose account, billing, and content
  data must be protected.
- Product: needs an honest production-readiness decision before launch work.
- Engineering: needs file/line findings and follow-up specs rather than vague
  security concerns.
