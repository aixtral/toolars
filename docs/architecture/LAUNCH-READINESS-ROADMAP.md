# Toolars Launch Readiness Reset And Roadmap

日期: 2026-06-24  
状态: Internal Alpha, not launch ready  
证据入口: `cd sites/toolars && pnpm audit:tool-inventory`

## 1. Executive Reset

Toolars 当前不能按“已完成、可上线”对外发布。现有站点已经具备高保真壳层、部分真实 workspace、Google-only sign-in / trial mode / Phase 4 backend seam 等基础，但真实验证暴露出一组上线阻塞问题：

- 多语言翻译没有完成，且还有大量 JSX 硬编码英文。
- 工具开发没有形成 `registry -> route -> workspace -> lib -> tests -> i18n` 的闭环。
- 工具数量、分类和展示计数与真实工具不一致。
- 分类切换、时间、阅读时长、运行次数等展示没有统一 locale formatter。
- Blog PC 端布局和国际化/SEO 链接不完整。
- VitalCalc 与 Aixtral Lab 两个源项目还没有完成生产级整合；部分工具只是展示或 generic fallback，并不可作为完整功能上线。

旧文档中 “339/339 tasks completed”“可上线生产化”等表述只能代表历史任务执行记录，不能继续作为 launch readiness 证据。后续发布判断必须以本文件和审计脚本输出为准。

## 2. Current Machine-Audited Baseline

命令:

```bash
cd sites/toolars
pnpm audit:tool-inventory
```

当前输出摘要:

```text
Toolars launch readiness: internal-alpha
Registry tools: 118
Public tools: 91
Registry by source: aixtral-lab=22, toolars=10, vitalcalc=86
VitalCalc source pages: 86
Aixtral Lab config/tools implemented: 92/66
Dedicated workspaces: 91
Category count mismatches: 0
Public tools missing workspace/lib: 0/0
Aixtral config missing from registry: 72
Registry tools missing Toolars lib: 27
```

### 2.1 Tool Inventory

| Area | Current | Interpretation |
| --- | ---: | --- |
| Toolars registry tools | 118 | Full catalog candidates: 86 VitalCalc, 10 Toolars/PDF/Data, 22 Aixtral Lab tools |
| Public launch-visible tools | 91 | `ready` or `trial-ready` tools only; preview tools are excluded from public category counts |
| VitalCalc source pages | 86 | Source parity looks complete at slug level, but formula/i18n/detail quality still needs per-tool gates |
| Aixtral Lab configured tools | 92 | Source project has a much larger AI/developer tool surface than Toolars currently exposes |
| Aixtral Lab implemented modules | 66 | Source project itself has 27 configured tools without matching implementation modules |
| Toolars dedicated workspaces | 91 | 27 registry tools currently rely on generic route or are incomplete |
| Toolars lib implementations | 93 | Includes non-public service modules; 27 registry tools still lack matching lib implementation |

### 2.2 Category Count Contract

Category counts are now derived from launch-visible tools instead of static marketing numbers. Current public counts:

| Category | Count |
| --- | ---: |
| All | 91 |
| AI | 4 |
| AI Security | 2 |
| RAG / MCP / Agent | 1 |
| LLM Cost | 1 |
| PDF | 1 |
| Finance | 42 |
| Health | 42 |

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

Status: partially complete.

Tasks:

- Keep this document as the canonical launch-readiness source.
- Keep `docs/architecture/CURRENT-STATUS-ROADMAP.md` as historical only.
- Add `pnpm audit:tool-inventory` to CI before any beta/release branch.
- Stop showing non-ready tools in public discovery unless explicitly marked preview/beta.

Exit criteria:

- Any status update references script output or test output.
- No document claims launch readiness without passing release gates.

### Phase 1: Catalog And Inventory Foundation

Status: started.

Tasks:

- Expand `scripts/audit-tool-inventory.mjs` to optionally write JSON reports under `output/audits/`.
- Add a catalog status model to registry or a generated catalog layer. Done in `sites/toolars/src/data/registry.ts`.
- Replace static category counts with derived counts filtered by locale/visibility/status. Done for public catalog counts.
- Add tests that fail when a visible tool lacks route, workspace, lib, or tests. Done in `scripts/audit-tool-inventory.test.mjs`.
- Add a source parity report for VitalCalc and Aixtral Lab.

Exit criteria:

- `pnpm audit:tool-inventory` shows zero category-count mismatches for public categories.
- Public catalog only includes `ready` or approved `trial-ready` tools.
- Every visible tool has an explicit status and owner/source.

### Phase 2: I18n Stabilization

Tasks:

- Add a hardcoded-text audit for `src/app/[locale]`, `src/components`, and workspace UI.
- Define allowlist for brand names, model names, code terms, file extensions, and standards.
- Translate remaining copied English values in `es`, `zh-hans`, and `zh-hant`.
- Migrate blog, category labels, tool cards, status text, settings, and high-traffic workspaces to message namespaces.
- Localize internal links with the active locale.

Exit criteria:

- Message key parity passes.
- English residue audit passes with allowlist only.
- Language switcher labels are distinct for Simplified and Traditional Chinese.
- Playwright confirms language switching keeps route, content, and active state consistent.

### Phase 3: Tool Functionality Completion

Tasks:

- Define launch batch 1:
  `pdf-toolkit`, `json-repair`, `prompt-injection-scanner`, `llm-cost-calculator`, `mcp-server-builder`, top VitalCalc finance/health tools.
- For VitalCalc, add formula golden tests against source examples and known calculators.
- For Aixtral Lab, reconcile slug mismatches such as `synthetic-dataset-gen` vs `synthetic-dataset-generator` and `http-status-reference` vs `http-status-codes`.
- Hide or mark preview for registry tools without dedicated implementation.
- Add per-tool acceptance fixtures.

Exit criteria:

- Launch batch tools pass unit, workspace, and browser smoke tests.
- Generic fallback is not used to imply full feature completion.
- Non-functional source tools are hidden from public discovery.

### Phase 4: Discovery, Time, And Category Consistency

Tasks:

- Replace static categories with derived catalog selectors.
- Add URL-backed category/filter state.
- Use locale-aware formatting for time, read time, run count, money, token counts, and percentages.
- Add tests for category switching across desktop and mobile.

Exit criteria:

- Category click count equals rendered list count.
- No hardcoded `2h ago`, `min read`, or `runs` text remains in localized UI.
- Empty categories render an intentional localized empty state.

### Phase 5: Blog Production Layout

Tasks:

- Redesign Blog index for PC with main content, right rail, categories/tags, and featured tools.
- Fix locale-prefixed links and metadata.
- Localize read time, categories, CTAs, breadcrumbs, and related-tool modules.
- Add visual checks for desktop and mobile.

Exit criteria:

- Blog index and detail pass desktop and mobile layout screenshots.
- SEO metadata and structured data are locale-correct.
- Blog routes do not break locale navigation.

### Phase 6: Release Gates

Tasks:

- Add a single launch readiness command that runs:
  - `pnpm test`
  - `pnpm typecheck`
  - `pnpm build`
  - `pnpm audit:tool-inventory`
  - i18n residue audit
  - route crawl
  - visual release gate
- Produce a Markdown/JSON launch report.

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
| I18n contract | planned `pnpm audit:i18n` | Verify key parity, locale links, and English residue |
| Category contract | planned registry/catalog tests | Verify derived counts and visible lists |
| Blog E2E | planned Playwright route checks | Verify locale metadata, links, and PC/mobile layout |
| Visual gate | `pnpm visual:release-gate` | Verify high-fidelity parity for selected screens |
| Production dry run | `pnpm build && pnpm start` plus crawler | Verify deployable app and route health |

## 6. Immediate Next Work

1. Add i18n hardcoded-text audit.
2. Fix Blog locale links and PC layout.
3. Expand `audit-tool-inventory` with `--write output/audits/tool-inventory.json`.
4. Start Aixtral Lab batch migration with tools that already have source implementations and clear interaction value.
5. Move preview tools into explicit beta/internal discovery surfaces instead of public navigation.
