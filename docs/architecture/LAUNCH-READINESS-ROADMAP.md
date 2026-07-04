# Toolars Launch Readiness Reset And Roadmap

日期: 2026-07-04
状态: Internal Alpha, not launch ready  
证据入口: `cd sites/toolars && pnpm audit:tool-inventory`

## 1. Executive Reset

Toolars 当前仍不能按“已完成、可上线”对外发布。现有站点已经具备高保真壳层、190 个公开工具的 dedicated route/workspace/lib/tests 闭环、Google-only sign-in / trial mode / Phase 4 backend seam 等基础；2026-07-04 的机器审计已清掉 i18n 和源 registry 阻塞，但发布前仍需要完整 route crawl、视觉门禁、每个公开工具的浏览器 smoke 和源公式/行为黄金用例。

- 多语言机器审计已通过，但上线前仍要做真实浏览器语言切换和页面走查。
- 工具开发已形成 `registry -> route -> workspace -> lib -> tests -> i18n` 的机器闭环，但还缺全量公开工具 smoke。
- 工具数量、分类和展示计数已由 registry 派生并通过审计，后续不能回退到静态营销数字。
- 分类切换、时间、阅读时长、运行次数等展示要继续保持 locale formatter 覆盖。
- Blog 多语言覆盖已通过审计，但仍需要桌面/移动视觉门禁确认宽度、上下篇、相关工具和 SEO 呈现。
- VitalCalc 与 Aixtral Lab 已完成 Toolars registry/workspace/lib 层整合；剩余风险是源公式/交互行为的 golden fixtures 还不够系统。

旧文档中 “339/339 tasks completed”“可上线生产化”等表述只能代表历史任务执行记录，不能继续作为 launch readiness 证据。后续发布判断必须以本文件和审计脚本输出为准。

## 2. Current Machine-Audited Baseline

命令:

```bash
cd sites/toolars
pnpm audit:tool-inventory
pnpm audit:i18n
pnpm audit:i18n-quality
```

当前输出摘要:

```text
Toolars launch readiness: internal-alpha
Registry tools: 190
Public tools: 190
Registry by source: aixtral-lab=92, toolars=12, vitalcalc=86
VitalCalc source pages: 86
VitalCalc source blog locales/slugs: 9/20
Aixtral Lab config/tools implemented: 92/66
Source locales / Toolars registered locales: 10/10
Toolars launch/draft/message locales: 4/6/10
Dedicated workspaces: 190
Category count mismatches: 0
VitalCalc blog slugs missing from Toolars: 0
Source locales missing from Toolars launch: 6
Hardcoded user-facing UI strings: 0
Public tools missing workspace/lib: 0/0
Aixtral config missing from registry: 0
Registry tools missing Toolars lib: 0
```

I18n 当前输出摘要:

```text
Toolars i18n audit: pass
Locales: en, ar, es, fr, hi, ja, pt, ru, zh-hans, zh-hant
Message key mismatches: 0
Copied English strings: 0
Copied English strings by phase: launch=0, draft=0
Hardcoded UI text candidates: 0
Absolute href candidates: 0
```

I18n 质量审计摘要:

```text
Toolars i18n quality audit: pass
Launch locales: en, es, zh-hans, zh-hant
Blockers: 0
Review items: 0
Blog localized coverage: en=23/23, es=23/23, zh-hans=23/23, zh-hant=23/23
Blog content English candidates: es=0, zh-hans=0, zh-hant=0
```

### 2.1 Tool Inventory

| Area | Current | Interpretation |
| --- | ---: | --- |
| Toolars registry tools | 190 | Full catalog candidates: 86 VitalCalc, 12 Toolars-native tools, 92 Aixtral Lab tools |
| Public launch-visible tools | 190 | Every public tool now has dedicated route, workspace, lib, and tests according to inventory audit |
| VitalCalc source pages | 86 | Source parity looks complete at slug level, but formula/detail quality still needs per-tool golden gates |
| VitalCalc source blog slugs | 20 | Blog source coverage is now tracked separately from tool source coverage |
| Source locales / Toolars locales | 10 / 10 | Four launch locales are public; six source locales remain draft/non-public by policy |
| Aixtral Lab configured tools | 92 | Toolars registry coverage is complete at config level |
| Aixtral Lab implemented modules | 66 | Source project itself still has 26 config-only tools without source implementation modules |
| Toolars dedicated workspaces | 190 | No public registry tool relies on the old generic route as launch evidence |
| Toolars lib implementations | 190 | Registry missing Toolars lib count is zero |

### 2.2 Category Count Contract

Category counts are now derived from launch-visible tools instead of static marketing numbers. Current public counts:

| Category | Count |
| --- | ---: |
| All | 190 |
| AI | 94 |
| AI Security | 11 |
| Developer | 36 |
| Frontend & Design | 16 |
| RAG / MCP / Agent | 6 |
| LLM Cost | 6 |
| PDF | 10 |
| Finance | 42 |
| Health | 42 |
| Data | 9 |
| Prompt Engineering | 4 |
| Productivity | 6 |
| Writing | 2 |

Launch rule: category counts must be derived from visible, launch-eligible tools. Static marketing counts are not allowed in production UI.

## 3. Blocking Gaps

### G1. Source Of Truth Gap

`sites/toolars/src/data/registry.ts` now separates full catalog candidates from public launch-visible tools with explicit status fields:

- `ready`: public, functional, tested, localized.
- `trial-ready`: public in Free Trial Mode with clear beta copy.
- `preview`: visible only in internal/beta surfaces.
- `hidden`: not shown in public discovery.
- `planned`: source-known but not implemented.

### G2. Tool Functionality Gap

Every public tool must pass this launch contract:

- Registry metadata exists.
- Public detail route resolves.
- Workspace route resolves.
- Pure function or service implementation exists.
- Unit tests cover normal, edge, and invalid input.
- Workspace tests cover input, run, output, reset/copy/export where applicable.
- Locale messages exist for visible text.
- Mobile layout has no horizontal overflow.

### G3. I18n Gap

Message key parity is not enough. Launch requires:

- No unapproved hardcoded user-facing English in localized routes.
- `zh-hans` and `zh-hant` labels must be visibly distinct, for example `简体` and `繁體`.
- Blog/category/tool/workspace/status text must use message namespaces.
- Time, number, read time, run count, currency, and percentages must use locale-aware formatters.

### G4. Discovery And Category Gap

Category tabs, collection filters, search facets, and counts must read from the same derived catalog. A user should never see a category count that cannot be reconciled with the list shown after clicking it.

### G5. Blog Gap

Blog is not production ready on desktop:

- Index needs a PC layout, not only a narrow mobile-like list.
- Locale-prefixed links, canonical URLs, OpenGraph URLs, breadcrumb schema, category labels, and read-time text must be localized.
- Detail pages need consistent related tools / TOC / responsive spacing.

### G6. Source Integration Gap

VitalCalc has slug-level parity, but formulas and UX still need source-backed golden tests. Aixtral Lab is far from complete: 72 configured source tools are not in Toolars registry, and 27 configured source tools do not have source implementations.

## 4. Development Plan

### Phase 0: Status Reset And Guardrails

Status: mostly complete.

Tasks:

- Keep this document as the canonical launch-readiness source.
- Keep `docs/architecture/CURRENT-STATUS-ROADMAP.md` as historical only.
- Add `pnpm audit:tool-inventory` to CI before any beta/release branch.
- Stop showing non-ready tools in public discovery unless explicitly marked preview/beta. Done by explicit status/visibility fields and inventory tests.

Exit criteria:

- Any status update references script output or test output.
- No document claims launch readiness without passing release gates.

### Phase 1: Catalog And Inventory Foundation

Status: complete for registry/workspace/lib coverage; report artifact automation still pending.

Tasks:

- Expand `scripts/audit-tool-inventory.mjs` to optionally write JSON reports under `output/audits/`. Done through `--json`.
- Add a catalog status model to registry or a generated catalog layer. Done in `sites/toolars/src/data/registry.ts`.
- Replace static category counts with derived counts filtered by locale/visibility/status. Done for public catalog counts.
- Add tests that fail when a visible tool lacks route, workspace, lib, or tests. Done in `scripts/audit-tool-inventory.test.mjs`.
- Add a source parity report for VitalCalc and Aixtral Lab. Done in `scripts/audit-tool-inventory.mjs`.

Exit criteria:

- `pnpm audit:tool-inventory` shows zero category-count mismatches for public categories.
- Public catalog only includes `ready` or approved `trial-ready` tools.
- Every visible tool has an explicit status and owner/source.

### Phase 2: I18n Stabilization

Status: machine-audited complete for message parity, English residue, hardcoded UI text, absolute hrefs, and blog localization coverage.

Tasks:

- Add a hardcoded-text audit for `src/app/[locale]`, `src/components`, and workspace UI. Done in `scripts/audit-i18n.mjs`.
- Define allowlist for brand names, model names, code terms, file extensions, and standards. Done in i18n audit scripts.
- Translate remaining copied English values in launch and draft locales. Done by `pnpm audit:i18n`.
- Migrate blog, category labels, tool cards, status text, settings, and high-traffic workspaces to message namespaces. Done for audited surfaces.
- Localize internal links with the active locale. Done for audited absolute href candidates.

Exit criteria:

- Message key parity passes.
- English residue audit passes with allowlist only.
- Language switcher labels are distinct for Simplified and Traditional Chinese.
- Playwright confirms language switching keeps route, content, and active state consistent.

### Phase 3: Tool Functionality Completion

Status: source and Toolars wiring complete; source-behavior golden coverage and full browser smoke still pending.

Tasks:

- Define launch batch 1:
  `pdf-toolkit`, `json-repair`, `prompt-injection-scanner`, `llm-cost-calculator`, `mcp-server-builder`, top VitalCalc finance/health tools.
- For VitalCalc, add formula golden tests against source examples and known calculators.
- For Aixtral Lab, reconcile slug mismatches such as `synthetic-dataset-gen` vs `synthetic-dataset-generator` and `http-status-reference` vs `http-status-codes`. Done through inventory aliases and Toolars-native source exceptions.
- Hide or mark preview for registry tools without dedicated implementation. Done; public missing workspace/lib is zero.
- Add per-tool acceptance fixtures.

Exit criteria:

- Launch batch tools pass unit, workspace, and browser smoke tests.
- Generic fallback is not used to imply full feature completion.
- Non-functional source tools are hidden from public discovery.

### Phase 4: Discovery, Time, And Category Consistency

Status: category count contract complete; full browser category interaction crawl still pending.

Tasks:

- Replace static categories with derived catalog selectors. Done in registry category selectors.
- Add URL-backed category/filter state.
- Use locale-aware formatting for time, read time, run count, money, token counts, and percentages.
- Add tests for category switching across desktop and mobile.

Exit criteria:

- Category click count equals rendered list count.
- No hardcoded `2h ago`, `min read`, or `runs` text remains in localized UI.
- Empty categories render an intentional localized empty state.

### Phase 5: Blog Production Layout

Status: localization coverage complete; visual/layout gate still pending.

Tasks:

- Redesign Blog index for PC with main content, right rail, categories/tags, and featured tools.
- Fix locale-prefixed links and metadata. Done for audited route coverage; still needs production crawler evidence.
- Localize read time, categories, CTAs, breadcrumbs, and related-tool modules. Done by i18n quality audit.
- Add visual checks for desktop and mobile.

Exit criteria:

- Blog index and detail pass desktop and mobile layout screenshots.
- SEO metadata and structured data are locale-correct.
- Blog routes do not break locale navigation.

### Phase 6: Release Gates

Status: started.

Tasks:

- Add a single launch readiness command that runs. Done as `pnpm launch:readiness`, with `--full` for browser and visual gates:
  - `pnpm test`
  - `pnpm typecheck`
  - `pnpm build`
  - `pnpm audit:tool-inventory`
  - i18n residue audit
  - route crawl in full mode
  - visual release gate in full mode
- Produce a Markdown/JSON launch report. Done under `output/launch-readiness/<run>/`.

Exit criteria:

- All gates pass.
- All public routes crawl successfully in every supported locale.
- All public tools run a smoke interaction.
- Visual diff thresholds pass for the agreed screen set.

## 5. Test And Verification Plan

| Layer | Command / Evidence | Purpose |
| --- | --- | --- |
| Tool inventory | `pnpm audit:tool-inventory` | Verify source/catalog/workspace/lib/test coverage |
| Unit tests | `pnpm test src/lib/tools/<slug>.test.ts` | Verify pure formulas and transformations |
| Workspace tests | `pnpm test src/app/[locale]/tools/<slug>/<slug>-workspace.test.tsx` | Verify input/run/output UI behavior |
| I18n contract | `pnpm audit:i18n` | Verify key parity, locale links, and English residue |
| Category contract | planned registry/catalog tests | Verify derived counts and visible lists |
| Route crawl | `pnpm launch:readiness -- --full --base-url http://127.0.0.1:9320` | Verify sitemap routes, language switching, draft-locale policy, and visual gates against a running app |
| Blog E2E | route crawl plus visual release gate | Verify locale metadata, links, and PC/mobile layout |
| Visual gate | `pnpm visual:release-gate` | Verify high-fidelity parity for selected screens |
| Production dry run | `pnpm build && pnpm start` plus crawler | Verify deployable app and route health |

## 6. Immediate Next Work

1. Run `pnpm launch:readiness -- --full --base-url http://127.0.0.1:9320` against a production server and triage browser/visual failures.
2. Add browser smoke for every public tool workspace, starting with input/run/output availability rather than full semantic assertions.
3. Add source golden fixtures for the highest-risk VitalCalc formulas and Aixtral Lab transformations.
4. Add CI wiring for `pnpm launch:readiness` on beta/release branches.
5. Decide whether the six draft locales stay non-public for this release or graduate through the launch-locale checklist.
