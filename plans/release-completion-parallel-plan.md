# Plan: release-completion-parallel

> 假设读者：对 Toolars 当前迁移上下文不熟的 junior 工程师；技术栈是 Next.js App Router、React 19、TypeScript、Vitest、next-intl、Playwright/browser smoke。执行时必须保持当前 Toolars UI/UX，不复制 Aixtral Lab 或 VitalCalc 的旧页面。

## Current Baseline

- Launch readiness: `internal-alpha`
- Registry tools: `190`
- Public tools / dedicated workspaces: `99 / 99`
- Public tools missing workspace/lib: `0 / 0`
- Registry tools missing Toolars lib: `91`
- Aixtral config missing from registry: `0`
- i18n audit: `needs-work`
- Message key mismatches: `0`
- Hardcoded UI text candidates: `2788`
- Copied English strings: `449`
- Absolute href candidates: `144`
- Draft locales not launch-ready: `ar`, `fr`, `hi`, `ja`, `pt`, `ru`
- Blog SEO risk: launch-locale sitemap may list VitalCalc-derived posts whose localized payload is incomplete; article JSON-LD/canonical language handling still needs focused verification.
- Language/category UX risk: left category clickability and RustDesk-style language menu behavior need browser-level coverage on desktop and mobile.

## Parallelization Rules

- Do not run multiple native tool migrations that edit `sites/toolars/messages/*.json`, `src/data/registry.ts`, or `src/data/tool-details.ts` in the same worktree at the same time.
- A tool-migration lane may migrate multiple slugs sequentially, but it is the only lane allowed to edit registry/detail/message tool namespaces during that wave.
- i18n cleanup lanes must avoid `tools.<slug>.workspace` namespaces currently owned by the tool-migration lane.
- QA/browser lanes may add tests and scripts, but should not change production UI unless a failing test proves a bug.
- Every production change follows RED -> GREEN -> verify. Config/docs-only changes name the exception in closeout evidence.

## Wave 17: Immediate P0 Parallel Lanes

| Lane | Owner | Scope | Write Boundary | Can Run With | Done Evidence |
|---|---|---|---|---|---|
| W17-A | worker/main | Finish Aixtral Batch 1 native tools: `url-encoder`, `html-entity-encoder`, `lorem-ipsum` | `src/lib/tools/<slug>*`, `src/app/[locale]/tools/<slug>/**`, `src/data/registry*`, `src/data/tool-details*`, `messages/*.json`, audit inventory tests | W17-B/C/D if they avoid shared tool namespaces | targeted tool tests, registry/detail/i18n tests, typecheck, audit inventory, browser smoke |
| W17-B | worker | i18n hardcoded hotspot cleanup pass 1 | selected non-tool-migration files and matching message namespaces only | W17-A/C/D | message coverage, audit i18n count, focused component tests |
| W17-C | worker | Language switcher + left category clickability QA | `src/components/shell/language-switcher*`, `src/components/shell/toolars-shell*`, QA tests/scripts; production only if test fails | W17-A/B/D | component tests, browser smoke for category/menu/locale route |
| W17-D | worker | Blog/SEO release completion pass 1 | `src/data/blog*`, `src/app/[locale]/blog/**`, `src/app/sitemap*`, `src/components/seo/**`, blog tests | W17-A/B/C | blog tests, sitemap tests, build without new metadata regressions |
| W17-E | main | Integration and evidence | `plans/*`, `.cdc/state/evidence.jsonl`, conflict resolution only | all lanes | full test/typecheck/build/audit/visual evidence |

### W17 Dispatch Order

Run these as separate subtasks/worktrees so shared files are reviewed before integration:

1. W17-C can start immediately because it is mostly tests and browser smoke, and should not touch messages or registry data.
2. W17-A can start immediately in one tool-migration worktree; it owns registry/detail/tool message namespaces for the wave.
3. W17-D can start immediately if it confines message edits to blog namespaces. If it needs broad locale source changes, pause before editing `messages/*.json`.
4. W17-B starts after W17-A confirms the exact tool namespaces it owns, or runs in an isolated worktree with an explicit “no registry/detail changes” boundary.
5. W17-E stays on the main thread: review diffs, resolve conflicts, run evidence, then update state.

## W17-A Detail: Batch 1 Completion

### Task A1: `url-encoder`

Files:
- `sites/toolars/src/lib/tools/url-encoder.test.ts`
- `sites/toolars/src/lib/tools/url-encoder.ts`
- `sites/toolars/src/app/[locale]/tools/url-encoder/page.tsx`
- `sites/toolars/src/app/[locale]/tools/url-encoder/url-encoder-workspace.test.tsx`
- `sites/toolars/src/app/[locale]/tools/url-encoder/url-encoder-workspace.tsx`
- `sites/toolars/src/data/url-encoder-native.test.ts`
- `sites/toolars/src/data/registry.ts`
- `sites/toolars/src/data/registry.test.ts`
- `sites/toolars/src/data/tool-details.ts`
- `sites/toolars/src/data/tool-details.test.ts`
- `sites/toolars/messages/{en,es,zh-hans,zh-hant}.json`

Steps:
1. Write RED tests for encode/decode, invalid percent sequence, workspace render/action, and ready/public registry promotion.
   Run: `pnpm exec vitest run src/lib/tools/url-encoder.test.ts 'src/app/[locale]/tools/url-encoder/url-encoder-workspace.test.tsx' src/data/url-encoder-native.test.ts`
   Expected: FAIL.
2. Implement pure local URL encode/decode library and Toolars-native workspace.
   Run same command.
   Expected: PASS.
3. Promote registry/detail and add four-locale workspace messages.
   Run: `pnpm exec vitest run src/data/registry.test.ts src/data/tool-details.test.ts src/lib/i18n/message-coverage.test.ts`
   Expected: PASS.
4. Browser smoke `/en/tools/url-encoder`.
   Expected: encode/decode visible, copy buttons enabled, console errors `0`.

### Task A2: `html-entity-encoder`

Follow the same structure as A1 with files under `html-entity-encoder`.

Required behavior:
- Encode special HTML characters.
- Decode named/numeric entities if supported by source behavior.
- Show safe rendering/review notes in Toolars UI.

Verify:
```bash
pnpm exec vitest run src/lib/tools/html-entity-encoder.test.ts 'src/app/[locale]/tools/html-entity-encoder/html-entity-encoder-workspace.test.tsx' src/data/html-entity-encoder-native.test.ts
pnpm exec vitest run src/data/registry.test.ts src/data/tool-details.test.ts src/lib/i18n/message-coverage.test.ts
```

### Task A3: `lorem-ipsum`

Follow the same structure as A1 with files under `lorem-ipsum`.

Required behavior:
- Generate configurable placeholder copy locally.
- Preserve source constraints for paragraph/word range.
- Include copy-all and local generation trust notes.

Verify:
```bash
pnpm exec vitest run src/lib/tools/lorem-ipsum.test.ts 'src/app/[locale]/tools/lorem-ipsum/lorem-ipsum-workspace.test.tsx' src/data/lorem-ipsum-native.test.ts
pnpm exec vitest run src/data/registry.test.ts src/data/tool-details.test.ts src/lib/i18n/message-coverage.test.ts
```

## W17-B Detail: i18n Hotspot Cleanup Pass 1

Goal: reduce hardcoded UI text without colliding with W17-A.

Initial target files from latest audit:
- `sites/toolars/src/app/[locale]/tools/biological-age/biological-age-workspace.tsx` (`38` candidates, namespace `tools.biological-age.workspace`)
- `sites/toolars/src/app/[locale]/tools/mortgage-refinance-calculator/mortgage-refinance-calculator-workspace.tsx` (`38`, namespace `tools.mortgage-refinance-calculator.workspace`)
- `sites/toolars/src/app/[locale]/tools/freelance-rate/freelance-rate-workspace.tsx` (`36`, namespace `tools.freelance-rate.workspace`)
- `sites/toolars/src/app/[locale]/tools/testosterone-calculator/testosterone-calculator-workspace.tsx` (`35`, namespace `tools.testosterone-calculator.workspace`)
- `sites/toolars/src/app/[locale]/tools/home-affordability-calculator/home-affordability-calculator-workspace.tsx` (`33`, namespace `tools.home-affordability-calculator.workspace`)
- Next queue: `student-loan-calculator` (`33`), `savings-challenge` (`32`), `sites/toolars/src/app/[locale]/my-tools/my-tools-dashboard-view.tsx` (`31`, namespace `myToolsDashboard`)

Recommended key groups:
- Tool workspaces: `eyebrow`, `title`, `subtitle`, `badges`, `trustRows`, `inputSection`, `fields`, `options`, `actions`, `resultSection`, `emptyStates`, `metrics`, `callout`, `review`, `notes`, `caveat`
- My Tools dashboard: `hero`, `command`, `filters`, `kpis`, `recentOutputs`, `favoriteTools`, `savedCollections`, `nextWorkflows`, `sharedLinks`, `storage`, `extension`, `teamUpsell`, `actions`

Steps:
1. Pick two files only for pass 1 to keep review small.
2. Write or extend component tests that assert user-facing labels through messages.
   Run focused Vitest for those files.
   Expected: FAIL if message keys are absent.
3. Move visible strings into `messages/{en,es,zh-hans,zh-hant}.json` under existing tool/page namespaces.
4. Run:
```bash
pnpm exec vitest run src/lib/i18n/message-coverage.test.ts <focused-tests>
pnpm run audit:i18n
```
Expected: message key mismatches `0`; hardcoded candidate count should not increase.

Pass 1 recommendation: pick `biological-age` and `mortgage-refinance-calculator` first. They are high-count, self-contained workspaces and do not overlap with W17-A's new native-tool namespaces.

## W17-C Detail: Language And Category QA

Goal: prove the RustDesk-style language/menu/category UX works across desktop and mobile.

Files:
- `sites/toolars/src/components/shell/language-switcher.test.tsx`
- `sites/toolars/src/components/shell/toolars-shell.test.tsx`
- optional `sites/toolars/scripts/browser-smoke-language-nav.mjs`
- optional `.cdc/state/evidence.jsonl` only via main integration

Required cases:
- Desktop language menu opens and lists only launch locales.
- Switching language preserves the current path when the locale exists.
- Draft locales remain hidden from the switcher.
- Left category links are real links/buttons and can navigate to category pages.
- Mobile menu exposes categories and language controls without overlap.
- Outside click closes the language menu and the current option is active.
- `/explore/pdf`, `/explore/ai-developer`, and `/explore/finance` preserve locale switching behavior.
- Active category coverage includes `ai-security`, `llm-cost`, `rag-mcp-agent`, `frontend-design`, plus the special PDF and AI pages.
- Browser smoke checks desktop and mobile viewports, saves screenshots under `output/language-ux-smoke/<runId>`, and reports console errors.

Verify:
```bash
pnpm exec vitest run src/components/shell/language-switcher.test.tsx src/components/shell/toolars-shell.test.tsx 'src/app/[locale]/explore/[category]/page.test.tsx' 'src/app/[locale]/explore/pdf/page.test.tsx' src/lib/i18n/index.test.ts src/proxy.test.ts
TOOLARS_BASE_URL=http://127.0.0.1:9321 node scripts/language-ux-smoke.mjs
```

## W17-D Detail: Blog/SEO Completion Pass 1

Goal: close the known blog follow-ups before release.

Files:
- `sites/toolars/src/data/blog.ts`
- `sites/toolars/src/data/blog.test.ts`
- `sites/toolars/src/app/[locale]/blog/page.tsx`
- `sites/toolars/src/app/[locale]/blog/[slug]/page.tsx`
- `sites/toolars/src/app/sitemap.test.ts`
- `sites/toolars/src/app/sitemap.ts`
- `sites/toolars/src/components/seo/json-ld.tsx`

Required cases:
- Blog index metadata is locale-aware.
- Article JSON-LD URLs/canonical/alternates are locale-aware.
- Sitemap excludes draft locales and includes launch locale blog URLs.
- Localized sitemap entries must not publish non-English article URLs unless the localized article payload exists and resolves.
- Article JSON-LD includes localized URL and `inLanguage`.
- `zh-hant` must not silently reuse Simplified Chinese article body for public Traditional routes.
- Blog UI chrome, category labels, dates, featured tool names, and featured tool descriptions use localized messages/data.
- `metadataBase` warning is removed or explicitly documented as deferred with owner/date.

Verify:
```bash
pnpm exec vitest run src/data/blog.test.ts 'src/app/[locale]/blog/page.test.tsx' src/lib/seo/json-ld.test.ts src/lib/seo/build-sitemap-entries.test.ts src/app/sitemap.test.ts
pnpm run typecheck
pnpm run build
pnpm run audit:i18n
pnpm run audit:tool-inventory
git diff --check
```

## Wave 18: Next Native Tool Batch

Run after W17-A lands and shared registry/message files are stable.

| Lane | Scope | Notes |
|---|---|---|
| W18-A | Batch 2 data formatters: `csv-to-json`, `json-to-csv`, `yaml-validator` | Running in worker `019f0473-9c45-7303-a08d-81940bd0e4b1`; owns only these tool namespaces |
| W18-B | i18n hotspot cleanup pass 2: `freelance-rate`, `testosterone-calculator` | Running in worker `019f0473-9df0-7e43-8ca6-654edc130c92` |
| W18-C | metadataBase warning cleanup | Running in worker `019f0473-9fc0-7dc3-a7d1-6ede0b245347`; no registry/message ownership |
| W18-D | Diff/text native tools: `json-diff`, `diff-checker`, `text-diff`, `markdown-to-json`, `xml-formatter` | Running in worker `019f0476-eecb-7292-b8b3-a19502fd262b`; owns only these tool namespaces |
| W18-E | Converter/parser native tools: `url-parser`, `number-base-converter`, `file-size-converter`, `chmod-calculator`, `ipv4-subnet-calculator`, `timestamp-converter`, `user-agent-parser` | Running in worker `019f0476-f075-7a80-be32-2a5b706011f3`; owns only these tool namespaces |
| W18-F | i18n hotspot cleanup pass 3: `home-affordability-calculator`, `student-loan-calculator` | Running in worker `019f0476-f21e-7c72-8039-a5e16520a163` |
| W18-G | i18n hotspot cleanup pass 4: `savings-challenge`, `my-tools` dashboard | Queued until a subagent slot opens |
| W18-H | Draft locale bundles: `fr`, `pt` | Queued until a subagent slot opens; bundles remain draft and not public routed |
| W18-I | Draft locale bundles: `hi`, `ja`, `ru` | Queued until a subagent slot opens; bundles remain draft and not public routed |
| W18-J | Draft Arabic/RTL readiness: `ar` | Queued until a subagent slot opens; verify `dir="rtl"` and keep non-public until release gate passes |

## Remaining Native Tool Backlog After Active Wave 18

The latest audit reports `88` registry tools without a Toolars-native lib/workspace before Wave 18 integration. Active W18 workers cover `15` of them. Remaining native backlog after those lanes lands:

- AI safety/lab: `agent-workflow-builder`, `ai-guardrail-config`, `context-window`, `embedding-playground`, `function-call-builder`, `hallucination-checker`, `jailbreak-detector`, `mcp-tester`, `model-comparator`, `pii-scanner`, `prompt-templates`, `rag-chunk-visualizer`, `rag-eval-bench`, `red-team-simulator`, `structured-output-formatter`, `synthetic-dataset-gen`, `synthetic-dataset-generator`, `token-budget-planner`, `toxicity-scanner`, `vision-prompt-builder`
- PDF/image/media: `ai-pdf-summarizer`, `extract-tables`, `ocr-scanner`, `pdf-compressor`, `pdf-merger`, `pdf-password-remover`, `pdf-signer`, `pdf-to-word`, `pdf-translator`, `barcode-generator`, `base64-image-encoder`, `code-to-image`, `image-resizer`, `qr-code-generator`, `svg-optimizer`
- Web/dev utilities: `certificate-decoder`, `code-minifier`, `cron-builder`, `cron-explainer`, `docker-compose-converter`, `env-editor`, `hash-generator`, `html-markdown-converter`, `html-preview`, `http-status-reference`, `json-formatter`, `json-path-tester`, `json-schema-builder`, `json-tree-viewer`, `jwt-decoder`, `markdown-table-generator`, `meta-tag-generator`, `mime-lookup`, `mock-data-generator`, `nanoid-generator`, `password-generator`, `regex-tester`, `robots-txt-generator`, `schema-validator`, `sql-formatter`, `toml-converter`, `unicode-search`
- Color/CSS/frontend: `color-contrast-checker`, `color-converter`, `color-palette-generator`, `css-animation-generator`, `css-border-radius-generator`, `css-box-shadow-generator`, `css-flexbox-generator`, `css-gradient-generator`, `css-grid-generator`, `css-to-tailwind-converter`, `css-unit-converter`

## Final Release Gate

Run only after all W17 lanes are integrated:

```bash
cd sites/toolars
pnpm exec vitest run src/data/registry.test.ts src/data/tool-details.test.ts src/lib/i18n/message-coverage.test.ts scripts/audit-tool-inventory.test.mjs
pnpm test
pnpm run typecheck
pnpm run build
pnpm run audit:tool-inventory
pnpm run audit:i18n
TOOLARS_BASE_URL=http://127.0.0.1:9321 pnpm run visual:release-gate
git diff --check
```

Expected:
- Public tools missing workspace/lib: `0/0`
- Message key mismatches: `0`
- Category count mismatches: `0`
- Visual release gate: PASS
- Browser smoke: PASS for language/category/blog and the newly promoted tools

## Main-Thread Integration Checklist

- Review each worker diff by file path before merging.
- Re-run the lane's focused tests after merge.
- Append evidence rows to `.cdc/state/evidence.jsonl`.
- Update `plans/complete-source-migration.state.md` with wave result.
- If two lanes touched `messages/*.json`, run message coverage before continuing.
- Do not mark release-ready while `audit:i18n` remains `needs-work` unless the owner explicitly narrows launch scope to four locales and accepts remaining hardcoded-copy debt.
