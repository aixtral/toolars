# Release Parallel Sprint

> Goal: close the remaining launch blockers from `plans/complete-source-migration.md`
> without pretending detail-only inventory equals full migration.

## Current Machine Baseline

- Launch readiness: `internal-alpha`
- Registry tools: `190`
- Public tools / dedicated workspaces: `94 / 94`
- Public missing workspace/lib: `0 / 0`
- Registry missing Toolars lib/workspace/tests: `96`
- i18n audit: `needs-work`
- Hardcoded UI candidates: `2831`
- Copied English strings: `428`
- Absolute href candidates: `144`
- Draft locales not launch-ready: `ar`, `fr`, `hi`, `ja`, `pt`, `ru`

## Parallel Lanes

| Lane | Owner | Scope | Write Boundary | Done Evidence |
|---|---|---|---|---|
| A | main thread | Integrate workers, update state, final gates | `plans/*`, `.cdc/state/*`, conflict resolution only | full test/typecheck/build/audit |
| B | worker | Native `base64-converter` workspace promotion | `src/lib/tools/base64-converter*`, `src/app/[locale]/tools/base64-converter/**`, registry/detail/messages for that slug only | slug tests + audit |
| C | worker | Native `case-converter` workspace promotion | `src/lib/tools/case-converter*`, `src/app/[locale]/tools/case-converter/**`, registry/detail/messages for that slug only | slug tests + audit |
| D | worker | Native `slug-generator` workspace promotion | `src/lib/tools/slug-generator*`, `src/app/[locale]/tools/slug-generator/**`, registry/detail/messages for that slug only | slug tests + audit |
| E | worker | Blog/locale release gap audit and smallest safe patch | blog pages/data/tests only; no registry | blog tests + typecheck |
| F | main thread | i18n hotspot cleanup | `toolars-shell`, common chrome, focused tests, messages | `audit:i18n` count reduced, key mismatches 0 |

## Sequencing Rules

- Workers must not revert unrelated dirty work.
- Workers must keep changes surgical and list exact files changed.
- Shared `messages/*.json`, `registry.ts`, and `tool-details.ts` edits are allowed only for the assigned slug/namespace.
- Main thread reviews worker diffs before merging.
- No lane is complete without a failing test first or a named exception.

## Sprint Exit Criteria

- At least three more Aixtral detail-only tools promoted to native public/workspace/lib status.
- `pnpm run audit:i18n` hardcoded candidates reduced from `2831`.
- `messageKeyMismatches` remains `0`.
- `pnpm test`, `pnpm typecheck`, `pnpm build`, `pnpm run audit:tool-inventory`, `pnpm run audit:i18n` all pass.

## Sprint Result

- Completed lanes:
  - B: `base64-converter` promoted to native public workspace/lib with focused lib, workspace, and registry tests.
  - C: `case-converter` promoted to native public workspace/lib with focused lib, workspace, and registry tests.
  - D: `slug-generator` promoted to native public workspace/lib with focused lib, workspace, and registry tests.
  - E: blog article metadata now uses locale-aware article data and localized canonical/alternate URLs.
  - F: shell sidebar chrome moved to message keys for workflow, collections, billing, settings, admin, PDF workspace, and workspace variants.
- Current audit result:
  - Public tools / dedicated workspaces: `98 / 98`
  - Public missing workspace/lib: `0 / 0`
  - Registry tools missing Toolars lib: `92`
  - Message key mismatches: `0`
  - Hardcoded UI candidates: `2787`
  - Copied English strings: `445`
  - Absolute href candidates: `144`
- Verification:
  - `pnpm exec vitest run src/components/shell/toolars-shell.test.tsx src/lib/i18n/message-coverage.test.ts src/lib/tools/base64-converter.test.ts 'src/app/[locale]/tools/base64-converter/base64-converter-workspace.test.tsx' src/data/base64-converter-native.test.ts src/lib/tools/case-converter.test.ts 'src/app/[locale]/tools/case-converter/case-converter-workspace.test.tsx' src/data/case-converter-native.test.ts src/lib/tools/slug-generator.test.ts 'src/app/[locale]/tools/slug-generator/slug-generator-workspace.test.tsx' src/data/slug-generator-native.test.ts 'src/app/[locale]/blog/page.test.tsx' src/data/blog.test.ts` passed, 13 files / 54 tests.
  - `pnpm exec vitest run src/data/registry.test.ts src/data/tool-details.test.ts scripts/audit-tool-inventory.test.mjs` passed, 3 files / 67 tests.
  - `pnpm test` passed, 276 files / 824 tests.
  - `pnpm run typecheck` passed.
  - `pnpm build` passed; existing `metadataBase` warnings remain.
  - `pnpm run audit:tool-inventory` passed.
  - `pnpm run audit:i18n` exited 0 and still reports `needs-work`.
  - `git diff --check` passed.
  - `TOOLARS_BASE_URL=http://127.0.0.1:9321 pnpm run visual:release-gate` passed after updating the mobile home baseline to the verified RustDesk-style shell/header: mobile 28/28 and desktop hotspots 4/4.

## Continuation Result: Wave 15

- Completed `text-stats` native promotion after the initial sprint:
  - Added `src/lib/tools/text-stats.ts` with source-backed copy metrics, timing estimates, and top-word analysis.
  - Added `/tools/text-stats` native workspace and route.
  - Promoted `text-stats` to ready/public and rewrote its detail page content to native workspace/trust copy.
  - Added four-locale workspace messages for `en`, `es`, `zh-hans`, and `zh-hant`.
- Latest verification:
  - Targeted `text-stats` tests passed, 3 files / 5 tests.
  - Registry/detail/i18n tests passed, 3 files / 65 tests.
  - `scripts/audit-tool-inventory.test.mjs` passed, 1 file / 5 tests.
  - `pnpm run typecheck`, `pnpm run audit:tool-inventory`, `pnpm test`, and `pnpm run build` passed.
  - `pnpm run audit:i18n` exits 0 with message key mismatches `0`; overall status remains `needs-work`.
  - Browser smoke passed on `http://127.0.0.1:9321/en/tools/text-stats` with sample copy analysis and console errors `0`.

## Continuation Result: Wave 16

- Completed `uuid-generator` native promotion:
  - Added `src/lib/tools/uuid-generator.ts` with source-backed UUID v4 generation, bulk generation, count validation, and UUID validation.
  - Added `/tools/uuid-generator` native workspace and route.
  - Promoted `uuid-generator` to ready/public and rewrote its detail page content to native workspace/trust copy.
  - Added four-locale workspace messages for `en`, `es`, `zh-hans`, and `zh-hant`.
- Latest audit result:
  - Public tools / dedicated workspaces: `99 / 99`
  - Public missing workspace/lib: `0 / 0`
  - Registry tools missing Toolars lib: `91`
  - Message key mismatches: `0`
  - Hardcoded UI candidates: `2788`
  - Copied English strings: `449`
  - Absolute href candidates: `144`
- Latest verification:
  - Targeted `uuid-generator` tests passed, 3 files / 6 tests.
  - Registry/detail/i18n tests passed, 3 files / 65 tests.
  - `scripts/audit-tool-inventory.test.mjs` passed, 1 file / 5 tests.
  - `pnpm run typecheck`, `pnpm run audit:tool-inventory`, `pnpm test`, and `pnpm run build` passed.
  - Browser smoke passed on `http://127.0.0.1:9321/en/tools/uuid-generator` with quantity `3`, three unique UUIDs, and console errors `0`.
