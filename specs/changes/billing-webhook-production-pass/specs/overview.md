# Spec Overview: billing-webhook-production-pass

This change implements the first runtime billing webhook productionization pass
using `docs/architecture/BILLING-SUBSCRIPTION-STATE-DESIGN.md` as the design
source of truth.

Capabilities:

- `billing-webhook-production`: Lemon Squeezy verification, event parsing,
  idempotency, subscription state mutation, and access mapping.
