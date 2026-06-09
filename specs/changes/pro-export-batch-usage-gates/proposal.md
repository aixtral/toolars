# Proposal: pro-export-batch-usage-gates

## Business Context

Toolars already has workspace subscriptions, AI generation plan gates, and
monthly usage counters. The remaining Pro workflow gap is that PDF/CSV exports
and batch tools are described in product copy but are not yet backed by
server-side plan and usage checks.

The project owner explicitly allowed skipping the real Supabase staging auth
rehearsal for now because the staging URL and test account are not available.
This change proceeds with that risk recorded and keeps the rehearsal as a
follow-up release gate.

## Problem Statement

Pro export and batch capabilities currently lack runtime enforcement. Without
server-side gates, the app cannot safely expose premium export or batch actions,
and subscription state cannot drive those capabilities consistently across
devices.

## Scope

### Included

- Extend plan definitions with monthly export and batch-run limits.
- Extend usage repository contracts for export and batch increments.
- Extend Supabase usage migration and adapter support for export and batch RPCs.
- Add authenticated API routes for PDF export, CSV export, and batch tool runs.
- Keep public calculators free and independent from billing, auth, and usage
  modules.

### Not Included

- Real staging Supabase auth rehearsal, because credentials are not available.
- Full file-generation fidelity, storage, or download persistence.
- Checkout and customer portal handoff.
- Durable AI job/output history.
- Customer-facing usage history UI.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Pro export enforcement | Product copy only | Server-side plan and usage gate |
| Batch tool enforcement | Product copy only | Server-side plan and usage gate |
| Calculator free boundary | Protected by import tests | Protected after new premium routes |

## Stakeholders

- Users: free calculators remain usable without login; premium workflows have
  clear upgrade behavior.
- Business: Pro features can be monetized without relying on client-only state.
- Engineering: future UI can call typed routes backed by existing billing and
  usage abstractions.
