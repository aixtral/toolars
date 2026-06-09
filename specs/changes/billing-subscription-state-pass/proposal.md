# Proposal: billing-subscription-state-pass

## Business Context

Toolars plans to keep calculators free while subscription-gating AI tools,
cross-device saving, PDF/CSV exports, and batch workflows. Current billing code
only verifies a preview-style webhook signature and parses a simplified
`subscription.updated` payload.

## Problem Statement

Without a source-backed subscription-state design, future billing work may miss
Lemon Squeezy event names, status mapping, webhook idempotency, replay safety,
or the boundary between provider events and Toolars plan gates.

## Scope

### Included

- Define Lemon Squeezy subscription-state design for Toolars.
- Map provider events and statuses to Toolars `free`, `pro`, and `team` access.
- Define webhook signature, idempotency, replay, and event storage behavior.
- Define database tables and service-role-only mutation boundaries.
- Define implementation sequence and verification gates.

### Excluded

- No Lemon Squeezy package/API client installation.
- No SQL migrations.
- No webhook route rewrite.
- No checkout/customer portal implementation.
- No production subscription mutation.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Billing state | preview webhook parse only | source-backed subscription state plan |
| Webhook safety | signature helper | idempotency, replay, event storage design |
| Plan gates | static plan IDs | provider-to-plan mapping and grace rules |
| Implementation risk | broad W2 task | sequenced billing passes with clear gates |

## Affected Stakeholders

- Users: subscription access must be accurate and not surprise-block paid users.
- Engineering: webhook implementation gets a stable schema and event contract.
- Support/ops: provider request/event IDs and status history become traceable.
- Security: service keys and billing event writes remain server-only.
