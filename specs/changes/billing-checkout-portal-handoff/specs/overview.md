# Overview: billing-checkout-portal-handoff

This change introduces server-owned checkout and portal handoff routes for the
existing Lemon Squeezy billing integration.

Capabilities:

- `billing-handoff`: checkout and customer portal redirect behavior.

Primary files:

- `site/lib/billing/handoff.ts`
- `site/lib/billing/runtime.ts`
- `site/app/api/billing/checkout/route.ts`
- `site/app/api/billing/portal/route.ts`
- `site/components/billing/billing-cards.tsx`

Source notes:

- Lemon Squeezy checkout URLs can carry prefill and custom data via query
  string parameters, including `checkout[custom][user_id]`.
- Lemon Squeezy Customer Portal can use signed subscription URLs or an unsigned
  store `/billing` URL.
