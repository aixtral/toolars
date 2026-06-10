# Specs Overview: customer-usage-summary-read-model

## Capability

- `usage-summary`: Current-period customer-facing usage read model for plan limits and usage snapshot.

## Acceptance Summary

- Usage summary is built from pure plan and snapshot inputs.
- The summary API requires an authenticated session and does not mutate usage counters.
- Billing UI renders AI generation, export, and batch usage from the summary.
- Public calculator pages remain independent from usage / billing imports.
