# W56 Release PR Summary Draft

Date: 2026-06-30
Repository: `/Users/stanvl/Documents/dev/ai-repo/toolars`
Scope: final release-readiness summary for the Toolars source-migration release.

## PR Title

Complete Toolars source migration, launch i18n, native tools, and release gates

## Summary

This release completes the Toolars migration from the Aixtral Lab / Aixtral Calm
source work into the current Toolars product shell, with native tool routes,
tool libraries, localized launch copy, blog parity, release smoke gates, and
production-readiness documentation.

The release snapshot is functionally green for shipped launch scope:

- 190 public tools, 190 registry tools, and 190 dedicated workspaces.
- VitalCalc source blog slugs missing from Toolars: 0.
- Toolars launch locales: `en`, `es`, `zh-hans`, `zh-hant`.
- Draft locales remain non-public: `ar`, `fr`, `hi`, `ja`, `pt`, `ru`.
- i18n audit reports zero message mismatches, copied-English strings,
  hardcoded UI candidates, and absolute href candidates.
- Build completes with 1791/1791 static pages and no `MISSING_MESSAGE` warnings.
- Visual release gate and language UX smoke pass on the current production build.

## Suggested Commit Slices

Use `plans/release-staging-manifest.md` as the source of truth for include,
exclude, and defer path families. Do not stage the entire dirty worktree at once.

1. Native tool migration by domain
   - `sites/toolars/src/app/[locale]/tools/**`
   - `sites/toolars/src/lib/tools/**`
   - `sites/toolars/src/data/**`
   - Split by tool family if review size is too large.

2. Launch i18n and locale gates
   - `sites/toolars/messages/*.json`
   - `sites/toolars/src/lib/i18n/**` if coupled to the release slice.
   - i18n audit / message coverage tests and scripts.

3. Blog/source parity and public content
   - Blog data, page tests, localized article/link behavior, and sitemap/metadata
     changes that support the migrated source content.

4. UI/UX release gates and language switcher polish
   - Language switcher interaction fixes.
   - Visual gate scripts and release smoke scripts.
   - Only include generated output artifacts by explicit evidence decision.

5. Production runtime and release hygiene
   - `sites/toolars/.env.example`
   - `sites/toolars/src/lib/tools/pdf-upload-server-store.ts`
   - `sites/toolars/src/lib/tools/pdf-upload-server-store.test.ts`
   - `sites/toolars/package.json`
   - `sites/toolars/pnpm-workspace.yaml`

6. Release docs and evidence
   - `.cdc/state/evidence.jsonl`
   - `plans/complete-source-migration.state.md`
   - `plans/release-staging-manifest.md`
   - `plans/release-go-no-go-checklist.md`
   - `plans/release-pr-summary.md`

## Exclude By Default

- `output/**`
- `toolars-text-stats-smoke.png`
- `.tasks/**`
- `.worktrees/**`
- timestamped screenshots and report directories, unless selected as external
  evidence instead of source.

## Verification Evidence

W56 final verification commands:

- `cdc-workflow hud --root .`
  - `mode:standard gate:ok`
- `pnpm run audit:tool-inventory`
  - registry tools `190`
  - public tools `190`
  - dedicated workspaces `190`
  - public tools missing workspace/lib `0/0`
  - registry tools missing Toolars lib `0`
  - VitalCalc blog slugs missing from Toolars `0`
- `pnpm run audit:i18n`
  - message key mismatches `0`
  - copied-English strings `0`
  - hardcoded UI candidates `0`
  - absolute href candidates `0`
- `pnpm run typecheck`
  - passed
- `pnpm exec vitest run scripts/audit-tool-inventory.test.mjs scripts/audit-i18n.test.mjs src/lib/i18n/message-coverage.test.ts src/lib/tools/pdf-upload-server-store.test.ts src/app/api/system/production-health/route.test.ts`
  - 5 files passed, 28 tests passed
- `pnpm run build`
  - passed, 1791/1791 static pages
  - no `MISSING_MESSAGE categories.*` warnings
- `TOOLARS_BASE_URL=http://127.0.0.1:9321 node scripts/draft-locale-non-public-smoke.mjs`
  - 3/3 checks passed

Recent smoke evidence paths:

- `output/visual-release-gate/2026-06-29T23-32-45-345Z`
- `output/language-ux-smoke/2026-06-29T23-33-59-387Z`
- `output/draft-locale-smoke/2026-06-29T23-41-42-035Z`

## Manual Release Confirmations

The code is green for the release gates above, but the final deploy should remain
No-Go until the release owner confirms these production settings in the hosting
provider:

- `NEXT_PUBLIC_SITE_URL`
- `TOOLARS_AUTH_SESSION_SECRET`
- `TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY`
- `TOOLARS_UPLOAD_HANDOFF_SECRET`
- `TOOLARS_DATA_DIR` or equivalent durable per-store paths, if persistence must
  survive redeploys.
- Google OAuth env, if real sign-in is enabled.
- Billing provider env, if paid plans are enabled.
- AI provider env, if cloud AI features are enabled.
- Sentry / PostHog env, if production monitoring is enabled.

Also confirm:

- Draft locales are not publicly announced or linked.
- Free Trial Mode is intentionally enabled or paid launch env is complete.
- Generated `output/**` artifacts are excluded from source commits by default.
- Aixtral one-to-one source accounting residual is described as post-release
  accounting work, not as missing shipped Toolars functionality.

## Release Note Draft

Toolars now ships the migrated native tool catalog and launch-localized product
experience, including source-backed tool workspaces, blog parity, RustDesk-style
language switching, release smoke gates, and production-runtime readiness checks.
The launch scope is verified across inventory, i18n, typecheck, build, visual
release gate, language UX smoke, draft-locale non-public smoke, and production
health tests.

## Residual Risks

- The dirty worktree is still large: current W56 snapshot is `291` modified and
  `384` untracked short-status entries. Commit slices must be reviewed manually.
- `audit:tool-inventory` still reports `Hardcoded user-facing UI strings: 33`,
  but `audit:i18n` reports hardcoded UI candidates `0`; this remains an inventory
  overbroad stable-token signal, not a release blocker.
- `audit:tool-inventory` reports source locales missing from Toolars launch `6`;
  these are draft locales and are verified non-public by smoke.
- Build still prints the accepted Next edge-runtime static-generation notice.
