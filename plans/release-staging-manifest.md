# W55 Release Staging Manifest

日期：2026-06-30
仓库：`/Users/stanvl/Documents/dev/ai-repo/toolars`
来源命令：`git status --short`

## 计数摘要

> 计数是默认 `git status --short` 的状态条目数。未跟踪目录按 Git short status
> 的目录条目计数，不递归展开为文件数。

| 大类 | 状态 | 条目数 | 建议 |
| --- | --- | ---: | --- |
| 全部 short-status 条目 | modified 291, untracked 384 | 675 | 分批 staging |
| `sites/toolars/messages/**` | modified 4, untracked 6 | 10 | include |
| `sites/toolars/src/app/[locale]/tools/**` | modified 186, untracked 99 | 285 | include |
| `sites/toolars/src/lib/tools/**` | modified 2, untracked 198 | 200 | include |
| `sites/toolars/src/data/**` | modified 7, untracked 49 | 56 | include |
| `sites/toolars/{package.json,scripts/**}` | modified 4, untracked 4 | 8 | include |
| `.cdc/state/**` | modified 1 | 1 | include, but verify freshness |
| `docs/**` | modified 1 | 1 | include if selected baseline |
| `design/**` | modified 1 | 1 | include if selected baseline |
| `plans/**` | untracked 1 | 1 | include selected plans only |
| `sites/toolars/src/app/**` outside tool routes | modified 58, untracked 9 | 67 | defer |
| `sites/toolars/src/components/**` | modified 16, untracked 5 | 21 | defer unless coupled to tool slice |
| other `sites/toolars/src/**` tests/support | modified 9, untracked 3 | 12 | defer unless coupled to tool slice |
| `sites/toolars/.env.example`, `sites/toolars/pnpm-workspace.yaml` | modified 2 | 2 | include |
| `output/**`, selected generated screenshots/reports, `toolars-text-stats-smoke.png` | untracked 8 | 8 | exclude by default |
| `.tasks/**`, `.worktrees/**` | untracked 2 | 2 | exclude |

## Include

Stage these path families for the release PR when building the W55 release
slice. Keep them grouped into small commits rather than staging the whole tree
at once.

- `sites/toolars/messages/*.json`
  - Current modified locales: `en`, `es`, `zh-hans`, `zh-hant`.
  - Current untracked locales: `ar`, `fr`, `hi`, `ja`, `pt`, `ru`.
- `sites/toolars/src/app/[locale]/tools/**`
  - Tool route pages, workspace views, and matching route/workspace tests.
  - Untracked tool directories should be reviewed per tool before staging.
- `sites/toolars/src/lib/tools/**`
  - Tool implementations and matching unit tests.
  - Commit together with the route/workspace that consumes each tool where possible.
- `sites/toolars/src/data/**`
  - Native tool tests and selected data fixtures required by those tests.
  - Verify any non-test data file is intentionally part of the release payload.
- `sites/toolars/package.json`
- `sites/toolars/scripts/audit-*.mjs`
- `sites/toolars/scripts/*.test.mjs`
- `sites/toolars/scripts/visual-verify-design-pack.mjs`
- `sites/toolars/scripts/draft-locale-non-public-smoke.mjs`
- `sites/toolars/scripts/language-ux-smoke.mjs`
- `sites/toolars/.env.example`
  - Include with the W54 PDF upload production secret documentation.
- `sites/toolars/pnpm-workspace.yaml`
  - Include with the W55 pnpm warning cleanup.
- `.cdc/state/evidence.jsonl`
  - Include only after confirming no unrelated evidence rows were appended after the
    W55 verification window.
- `docs/architecture/LAUNCH-READINESS-ROADMAP.md`
- `design/04-toolars-home-mobile.png`
- `plans/**`
  - Include only selected release planning documents, including this manifest and
    `plans/release-go-no-go-checklist.md`.

## Exclude

Do not stage these by default.

- `output/**`
- `output/visual-release-gate/*/`
- `output/draft-locale-smoke/`
- `output/language-ux-smoke/`
- `output/w53-e-language-measure/`
- `**/screenshots/**`
- `**/*report*/**`
- `toolars-text-stats-smoke.png`
- `.tasks/**`
- `.worktrees/**`

Generated reports, smoke output, screenshots, and the text-stats smoke PNG may
be attached or referenced as evidence separately, but should not be bundled into
the source release commit unless explicitly selected.

## Defer

Hold these until a reviewer decides they belong in the same release slice or in
a separate follow-up PR.

- `sites/toolars/src/app/**` outside `sites/toolars/src/app/[locale]/tools/**`
  - Includes admin, blog, collections, explore, settings, pricing, layout, page,
    metadata, sitemap, and other app-shell surfaces.
- `sites/toolars/src/components/**`
  - Stage only when the matching route/tool change requires it.
- `sites/toolars/src/i18n/**`
- `sites/toolars/src/proxy.test.ts`
- `sites/toolars/src/app/layout.test.tsx`
- `sites/toolars/src/app/sitemap.test.ts`

## 风险说明

- 工作树很大且多人并行，`git status --short` 的结果可能在 manifest 写入后继续漂移。
- 本 manifest 写入期间，状态摘要从 `modified 290, untracked 383` 漂移到最终观察到的
  `modified 291, untracked 384`；这些计数是快照，不是锁定清单。
- untracked 目录在 short status 中折叠为单条记录；实际 staging 前需要对目标路径做更细粒度复核。
- `.cdc/state/evidence.jsonl` 是追加型证据文件，容易混入其他任务的新证据行。
- `output/**` 和截图类文件体积及时间戳噪声高，默认不应进入发布源码 commit。
- `sites/toolars/src/app/[locale]/tools/**` 与 `sites/toolars/src/lib/tools/**`
  规模最大，建议按工具域或测试域分批提交，避免一个 PR 同时承载不可审的 400+ 条路径变化。
