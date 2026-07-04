# W55-C Release Go/No-Go Checklist

Scope: final human release decision for the source-migration release after W53/W54.
This checklist is intentionally independent from state/evidence logs and should be
used alongside the W55 staging manifest and final smoke evidence refresh.

## Go Conditions

- [ ] W54 green evidence is still current or has been refreshed for the release SHA:
  `audit:i18n` reports `0` message key mismatches, `0` copied-English,
  `0` hardcoded UI candidates, and `0` absolute href candidates.
- [ ] Typecheck, build, focused blog/category/PDF upload tests, production-health
  route test, and language UX smoke are green for the staged release snapshot.
- [ ] Build output has no `MISSING_MESSAGE categories.*` warnings; only explicitly
  accepted non-blocking warnings remain, such as the Next edge-runtime static
  generation notice.
- [ ] Tool inventory remains release-ready for shipped implementation:
  registry/public/workspace/lib coverage is `190/190/190`, public missing
  workspace/lib is `0/0`, and registry missing Toolars lib is `0`.
- [ ] Production env has been confirmed in the hosting provider, not only in local
  `.env`: `NEXT_PUBLIC_SITE_URL`, `TOOLARS_AUTH_SESSION_SECRET`,
  `TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY`, and `TOOLARS_UPLOAD_HANDOFF_SECRET`.
- [ ] `NEXT_PUBLIC_SITE_URL` is the real canonical production origin and matches
  OAuth redirect, sitemap, robots, OpenGraph, JSON-LD, and any CDN/domain config.
- [ ] Production persistence is deliberate: `TOOLARS_DATA_DIR` or per-store paths
  point at durable storage if account/auth/AI/PDF ledgers must survive redeploys.
- [ ] Google OAuth env is either fully configured for real sign-in
  (`GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`,
  `GOOGLE_OAUTH_REDIRECT_URI`) or Free Trial Mode behavior is explicitly accepted.
- [ ] Billing and AI provider env are either configured for paid/AI launch
  (`TOOLARS_BILLING_PROVIDER_*`, `TOOLARS_AI_PROVIDER_*`) or the release notes
  explicitly state local-preview / not-configured behavior.
- [ ] Draft locales `ar`, `fr`, `hi`, `ja`, `pt`, and `ru` remain non-public:
  no public routes, sitemap entries, hreflang links, or language-switcher entries.
- [ ] Generated `output/**` artifacts are excluded from the release commit by
  default; only selected evidence artifacts may be staged if the release owner
  intentionally includes them.
- [ ] Aixtral parity residual is documented as non-blocking: Toolars native shipped
  registry coverage is complete, while some upstream Aixtral source/config entries
  do not map one-to-one and remain post-release accounting work.
- [ ] W55-A pnpm warning handling, W55-B staging include/exclude manifest, and
  W55-D final smoke evidence paths are resolved or explicitly deferred by the
  release owner before tagging.

## No-Go Blockers

- [ ] Any production-required env above is missing, blank, copied from local
  fallback defaults, or cannot be confirmed in the hosting provider.
- [ ] PDF upload encryption or signed handoff secrets rely on local fallback
  behavior in production.
- [ ] Draft locales are publicly reachable, indexed, linked in hreflang, shown in
  the language switcher, or described as production-ready.
- [ ] `output/**`, screenshots, visual reports, local caches, or other generated
  artifacts are staged without an explicit evidence-only reason.
- [ ] Release notes claim full Aixtral source-backed parity without the residual
  one-to-one mapping caveat.
- [ ] Build, typecheck, i18n audit, focused tests, production-health test, language
  smoke, or final visual/browser release gate fails on the release snapshot.
- [ ] `MISSING_MESSAGE` warnings reappear for launch locales or public category
  pages.
- [ ] The dirty-worktree staging set has not been reviewed against the W55 staging
  manifest, including untracked message bundles and generated artifacts.
- [ ] Secrets scan finds real credentials, tokens, private keys, or provider keys
  in tracked files.
- [ ] Free Trial Mode, billing, OAuth, AI provider behavior, or production
  persistence mode is ambiguous to the release owner.

## Manual Confirmation Items

- [ ] Release owner signs off on the exact commit SHA / deploy artifact.
- [ ] Release owner confirms the production hosting env values are set in the
  deployment target and not only in local files.
- [ ] Release owner confirms secret rotation plan:
  `TOOLARS_AUTH_SESSION_SECRET_PREVIOUS` is set only when needed for active
  cookie migration.
- [ ] Release owner confirms PDF upload data retention and storage path policy.
- [ ] Release owner confirms whether Sentry and PostHog are enabled for launch:
  `SENTRY_*`, `NEXT_PUBLIC_SENTRY_*`, `NEXT_PUBLIC_POSTHOG_*`.
- [ ] Release owner confirms Free Trial Mode remains `enabled` or that billing
  provider env and user-facing paid-plan copy are ready.
- [ ] Release owner confirms draft locales are not announced publicly.
- [ ] Release owner confirms generated smoke/visual evidence paths are referenced
  externally or in the release note without staging bulk generated output.
- [ ] Release owner confirms Aixtral residual wording is included in release notes
  as a tracked post-release parity/accounting item, not a shipped-feature blocker.

## Rollback And Observability

- [ ] Record deploy SHA, previous stable SHA, release timestamp, and environment
  variable snapshot owner before promotion.
- [ ] Keep the previous stable deployment available for immediate rollback.
- [ ] Smoke after deploy: home, category page, blog page, one localized tool detail,
  PDF upload workflow, production-health route, sitemap, and language switcher.
- [ ] Watch production logs for `MISSING_MESSAGE`, auth session secret errors,
  PDF upload encryption/handoff errors, storage path fallback warnings, OAuth 503s,
  AI provider not-configured errors, and billing preview-account fallbacks.
- [ ] Watch Sentry/PostHog, if enabled, for elevated client/server error rates,
  broken navigation, upload failures, and locale routing anomalies.
- [ ] Roll back immediately if production env validation fails, PDF upload data
  cannot be decrypted/read, launch locales break public navigation, or generated
  artifacts were accidentally deployed as tracked release assets.
- [ ] After rollback, preserve failing logs/evidence paths and reopen the release
  gate with the exact failed checklist items marked.
