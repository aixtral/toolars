# Proposal: billing-checkout-portal-handoff

## Business Context

Toolars now has durable subscription ingestion, AI/Pro feature gates, and
workspace usage metering. The next monetization gap is the user handoff: users
need a server-owned path to start checkout and manage an existing subscription.

Lemon Squeezy official guidance supports directing customers to checkout URLs
and passing custom data via `checkout[custom][...]` query parameters. Its
Customer Portal can be reached through signed `customer_portal` URLs stored on
subscription/customer objects, or through an unsigned store `/billing` URL.

## Problem Statement

Pricing and upgrade prompts currently cannot send authenticated users through a
safe billing handoff. The webhook parser expects `meta.custom_data.workspace_id`,
but checkout links are not yet decorated with workspace context.

## Scope

### Included

- Add server-side billing checkout URL construction for Pro/Team checkout links.
- Require an authenticated workspace session for checkout handoff.
- Append `workspace_id`, `user_id`, and email prefill query parameters to
  configured checkout URLs.
- Add billing portal handoff that prefers signed subscription
  `customerPortalUrl` and falls back to a configured unsigned store billing URL.
- Add API route tests for auth, missing config, redirects, and safe URL
  validation.
- Keep public calculator pages free from billing dependencies.

### Not Included

- Creating Lemon Squeezy checkouts through outbound API calls.
- Installing Lemon Squeezy SDKs.
- Customer-facing billing settings UI beyond callable routes.
- Real staging Supabase auth rehearsal; still pending staging URL and test
  account.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Upgrade CTA destination | Not wired | Authenticated checkout redirect |
| Workspace checkout attribution | Missing | `checkout[custom][workspace_id]` |
| Manage plan action | Not wired | Portal redirect with signed/unsigned fallback |

## Stakeholders

- Users: can start checkout or manage billing from account context.
- Business: Pro upgrade path is no longer only copy.
- Engineering: webhook `workspace_id` attribution becomes aligned with checkout
  handoff.
