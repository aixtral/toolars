# Plan: complete-source-migration

> 假设读者：对 Toolars 零上下文的 junior 工程师；技术栈是 Next.js App Router、React 19、TypeScript、Vitest、next-intl。执行时必须遵守现有 `sites/toolars` 设计系统：`ToolarsShell`、typed registry、workspace 模板、local-first / AI-consent 标记、Command Center、响应式 CSS 和视觉回归脚本。

## 目标

把 `/Users/stanvl/Documents/dev/ai-repo/aixtral-lab` 与 `/Users/stanvl/Documents/dev/ai-repo/aixtral-calm/vitalcalc` 的工具、blog、locale 内容完整迁移到 Toolars，同时不复用旧 UI。源项目只作为 inventory、纯逻辑、测试用例、SEO/content 和翻译来源；最终呈现必须适配当前 Toolars UI/UX。

## 当前基线

- Toolars app root：`sites/toolars`
- 当前 registry：118 tools，其中 `vitalcalc=86`、`aixtral-lab=22`、`toolars=10`
- VitalCalc 工具覆盖：源侧 86 个 root tool pages，当前 registry 缺口 0
- Aixtral Lab 缺口：源侧 config 92 个，当前 registry 缺 72 个；其中 27 个源侧也缺 pure implementation，需要从页面/client 或需求重新建逻辑
- Blog 缺口：VitalCalc 源侧 9 个 locale 各 20 篇；当前 Toolars blog 只有 3 篇自有文章，源侧 20 篇英文 slug 全缺
- Locale 缺口：Aixtral Lab 有 `ar/en/es/fr/hi/ja/pt/ru/zh-cn/zh-tw`；Toolars 当前只有 `en/es/zh-hans/zh-hant`
- 已知专业审查缺口：`TRANSLATION-REVIEW.md` 标记医疗内容需专业审核，法律内容非英语 locale 仍 fallback 到英文

## UI/UX 迁移原则

- 不复制 VitalCalc Astro 页面或 Aixtral Lab 旧 Next UI。
- 每个工具必须落到 Toolars 现有视觉语言：左侧分类、顶部搜索、工具卡、workspace shell、右侧 workflow/resource rail、统一按钮/输入/状态/空态。
- 工具 workspace 按类型复用模板，不为每个工具手写一套新布局：
  - calculator：输入面板 + 结果面板 + explanation/assumptions
  - converter/formatter：双栏 input/output + copy/download
  - generator：参数面板 + preview/output + export
  - validator/scanner：input + findings/severity + remediation
  - builder/config：分段表单 + generated artifact + validation
  - file/image：upload/preview + local retention + AI consent split
- 所有 AI 或云处理必须保留独立 consent boundary；本地工具要明确标记 local-first。
- 所有新增页面必须做 desktop 1440px、mobile 390px 浏览器 QA，不能出现横向溢出、文字重叠、旧 UI 风格漂移。

## 文件结构

- `plans/complete-source-migration.md` ← 本计划
- `specs/changes/complete-source-migration/{proposal.md,design.md,tasks.md,specs/**/*.md}` ← 若进入 CDC spec 阶段再补齐
- `sites/toolars/scripts/audit-tool-inventory.mjs` ← 扩展工具、blog、locale、workspace 覆盖审计
- `sites/toolars/src/data/registry.ts` ← 工具 registry、分类、public/hidden 状态
- `sites/toolars/src/data/tool-details.ts` ← public detail / SEO 数据
- `sites/toolars/src/data/blog.ts`, `blog-es.ts`, `blog-zh.ts` ← 先保留，后续迁到统一 locale blog 数据
- `sites/toolars/src/data/locales.ts` ← 扩展 locale matrix
- `sites/toolars/messages/*.json` ← UI chrome、工具、blog、专业内容翻译
- `sites/toolars/src/lib/tools/*.ts` ← 纯逻辑迁移
- `sites/toolars/src/app/[locale]/tools/**` ← workspace 页面
- `sites/toolars/src/app/[locale]/blog/**` ← blog index/article 路由
- `sites/toolars/src/components/**` ← 只新增共享模板/控件，不复制源 UI
- `sites/toolars/TRANSLATION-REVIEW.md` ← 专业审查状态

## CDC Lint File Paths

以下路径相对 `sites/toolars`，用于执行阶段和 `cdc-doctor --plan-lint`：

- scripts/audit-tool-inventory.mjs
- src/data/registry.ts
- src/data/tool-details.ts
- src/data/blog.ts
- src/data/locales.ts
- src/i18n/request.ts
- src/lib/tools/<slug>.ts
- src/app/[locale]/tools/<slug>/page.tsx
- src/app/[locale]/tools/<slug>/<slug>-workspace.tsx
- src/app/[locale]/blog/[slug]/page.tsx
- src/components/workspace/tool-workspace-template.tsx
- messages/en.json

## 覆盖关系

| Task | covers | verify |
|---|---|---|
| 0 | 基线保护、当前行为不回退 | `pnpm test`, `pnpm typecheck`, `pnpm build` |
| 1 | 工具/blog/locale 审计可机器验证 | `pnpm run audit:tool-inventory`，新增 `audit:source-migration` |
| 2 | Toolars UI/UX 适配合同 | `pnpm run visual:release-gate`，browser desktop/mobile QA |
| 3 | Aixtral Lab 72 个工具 registry/detail 覆盖 | `pnpm test -- registry tool-details`，audit 缺口为 0 |
| 4 | Aixtral Lab 已有 pure implementation 工具功能迁移 | `pnpm test -- <tool-slug>`，`pnpm typecheck` |
| 5 | Aixtral Lab 需要重建逻辑的工具功能迁移 | 每工具 RED/GREEN 测试 + browser QA |
| 6 | VitalCalc 20 篇 blog 迁移 | `pnpm test -- blog`，静态路由包含全部 slug |
| 7 | 10 locale 全量翻译和 fallback 策略 | `pnpm test -- message-coverage i18n`，硬编码文案审计 |
| 8 | 最终 release gate | full test/typecheck/build/audit/visual/browser evidence |

## 步骤

### Step 0: 锁定当前基线

文件：不改生产代码。
⏱ ~ 5 min

跑：
```bash
cd sites/toolars
pnpm test
pnpm typecheck
pnpm build
pnpm run audit:tool-inventory
```

verify: `pnpm test && pnpm typecheck && pnpm build && pnpm run audit:tool-inventory`
cdc-lint verify: `npm test`
跑：`pnpm test && pnpm typecheck && pnpm build && pnpm run audit:tool-inventory`
expected: PASS；记录当前 `Registry by source`、Aixtral 缺口、Blog 缺口。若这里失败，先修 baseline，不进入迁移。
期望：PASS

### Step 1: 扩展审计脚本，先让缺口可见

⏱ ~ 5 min per RED/GREEN edit

测试先写：
- `sites/toolars/scripts/audit-source-migration.test.mjs` 或把断言并入现有 audit test

实现：
- 扩展 `sites/toolars/scripts/audit-tool-inventory.mjs`
- 输出新增 JSON 字段：
  - `sources.aixtralLab.configTools = 92`
  - `gaps.aixtralLab.configMissingFromRegistry`
  - `sources.vitalcalc.blogByLocale`
  - `gaps.blog.missingVitalcalcSlugs`
  - `sources.locales.sourceLocales`
  - `gaps.locales.missingLaunchLocales`
  - `gaps.i18n.hardcodedUserFacingStrings`

跑：
```bash
cd sites/toolars
pnpm test -- audit-tool-inventory
pnpm run audit:tool-inventory
```

verify: `pnpm test -- audit-tool-inventory && pnpm run audit:tool-inventory`
cdc-lint verify: `npm test -- audit-tool-inventory`
跑：`pnpm test -- audit-tool-inventory && pnpm run audit:tool-inventory`
expected: FAIL first, then PASS；缺口数仍大于 0。这个阶段只增强仪表盘，不迁移功能。
期望：FAIL

### Step 2: 建立 UI/UX 适配合同

⏱ ~ 5 min per template/test slice

测试先写：
- `sites/toolars/src/components/workspace/tool-workspace-template.test.tsx`
- `sites/toolars/src/app/[locale]/tools/[slug]/tool-workspace-shell-view.test.tsx`

实现：
- 抽出或完善共享 workspace 模板，覆盖 calculator、formatter、generator、scanner、builder、file/image 六类。
- 每个模板必须支持：title、description、privacy badge、category tags、primary action、copy/export、error/empty/loading 状态。
- 禁止从源项目搬页面 CSS；只使用 `sites/toolars/src/app/globals.css` 里的 Toolars token/组件风格，必要时新增通用 class。

跑：
```bash
cd sites/toolars
pnpm test -- tool-workspace-template tool-workspace-shell-view
pnpm typecheck
pnpm run visual:release-gate
```

verify: `pnpm test -- tool-workspace-template tool-workspace-shell-view && pnpm typecheck && pnpm run visual:release-gate`
cdc-lint verify: `npm test -- tool-workspace-template tool-workspace-shell-view`
跑：`pnpm test -- tool-workspace-template tool-workspace-shell-view && pnpm typecheck && pnpm run visual:release-gate`
expected: PASS。若 visual gate 发现旧 UI 风格或移动端溢出，本阶段不算完成。
期望：PASS

### Step 3: Aixtral Lab registry/detail 先全量登记，但默认不公开未完成 workspace

⏱ ~ 5 min per registry/detail batch

测试先写：
- `sites/toolars/src/data/registry.test.ts`
- `sites/toolars/src/data/tool-details.test.ts`

实现：
- 将 Aixtral Lab 72 个缺失 config 工具全部登记到 `registry.ts`。
- 对未完成 workspace 的工具设为 internal/hidden 或 `migrationStatus: "detail-only"`，不能假装 fully functional。
- 给每个工具补 `tool-details.ts`：SEO title、description、category、use cases、privacy model、source mapping。
- 分类页、Command Center、详情页必须能解释工具状态；public 列表只展示可打开的工具。

跑：
```bash
cd sites/toolars
pnpm test -- registry tool-details tool-detail-view command-search
pnpm run audit:tool-inventory
```

verify: `pnpm test -- registry tool-details tool-detail-view command-search && pnpm run audit:tool-inventory`
cdc-lint verify: `npm test -- registry tool-details tool-detail-view command-search`
跑：`pnpm test -- registry tool-details tool-detail-view command-search && pnpm run audit:tool-inventory`
expected: PASS；Aixtral config registry 缺口归零；public 工具仍不能指向不可用 workspace。
期望：PASS

### Step 4: 迁移 Aixtral Lab 已有 pure implementation 的工具

⏱ ~ 5 min per micro-step; one batch repeats these micro-steps for 5-8 tools

批次规则：每批 5-8 个工具，优先从源侧已有 `src/lib/tools/<slug>.ts` 的工具开始。推荐批次：
- data/format：`csv-to-json`, `json-to-csv`, `json-diff`, `yaml-validator`, `toml-converter`, `xml-formatter`
- text/encoding：`base64-converter`, `base64-image-encoder`, `url-encoder`, `case-converter`, `slug-generator`, `text-stats`
- dev/web：`sql-formatter`, `regex-tester`, `jwt-decoder`, `uuid-generator`, `hash-generator`, `password-generator`
- CSS/color：`color-converter`, `color-contrast-checker`, `color-palette-generator`, `css-grid-generator`, `css-flexbox-generator`, `css-border-radius-generator`, `css-box-shadow-generator`, `css-to-tailwind-converter`
- AI/security：`toxicity-scanner`, `system-prompt-guard`, `red-team-simulator`, `embedding-playground`, `synthetic-dataset-gen`

每个工具按这个微步骤执行：
1. 读源文件：
```bash
rg -n "export|function|describe|test" /Users/stanvl/Documents/dev/ai-repo/aixtral-lab/src/lib/tools/<slug>.ts
```
2. 写 Toolars RED 测试：
   - `sites/toolars/src/lib/tools/<slug>.test.ts`
   - `sites/toolars/src/app/[locale]/tools/<slug>/<slug>-workspace.test.tsx`
3. 迁移 pure logic：
   - `sites/toolars/src/lib/tools/<slug>.ts`
4. 用 Step 2 的模板实现 workspace：
   - `sites/toolars/src/app/[locale]/tools/<slug>/page.tsx`
   - `sites/toolars/src/app/[locale]/tools/<slug>/<slug>-workspace.tsx`
5. 补 registry/detail/messages。
6. 跑：
```bash
cd sites/toolars
pnpm test -- <slug>
pnpm typecheck
pnpm build
```
7. 浏览器 QA：
```bash
cd sites/toolars
pnpm dev
```
打开 `/en/tools/<slug>`、`/es/tools/<slug>`、390px mobile。

verify: `pnpm test -- <slug> && pnpm typecheck && pnpm build`
cdc-lint verify: `npm test -- <slug>`
跑：`pnpm test -- <slug> && pnpm typecheck && pnpm build`
expected: FAIL first, then PASS；每个工具从 RED 到 GREEN；UI 看起来像 Toolars，不像源项目。
期望：FAIL

### Step 5: 重建 Aixtral Lab 没有 pure implementation 的工具

⏱ ~ 5 min per micro-step; one batch repeats these micro-steps for 5-8 tools

范围：审计中的 `aixtralConfigWithoutImplementation = 27`。这些不能只复制页面/client；要从用户可见行为抽出纯函数。

每个工具按这个微步骤执行：
1. 读源 route/client/presets：
```bash
rg -n "<slug>|function|useState|preset|example" /Users/stanvl/Documents/dev/ai-repo/aixtral-lab/src/app/[locale]/tools/<slug>
```
2. 写行为 spec 测试：
   - `sites/toolars/src/lib/tools/<slug>.test.ts`
3. 写 workspace interaction 测试：
   - `sites/toolars/src/app/[locale]/tools/<slug>/<slug>-workspace.test.tsx`
4. 实现 pure logic 和 template UI。
5. 补 messages 与 tool detail。
6. 跑：
```bash
cd sites/toolars
pnpm test -- <slug>
pnpm typecheck
pnpm build
```

verify: `pnpm test -- <slug> && pnpm typecheck && pnpm build`
cdc-lint verify: `npm test -- <slug>`
跑：`pnpm test -- <slug> && pnpm typecheck && pnpm build`
expected: FAIL first, then PASS；功能输出与源页面行为等价；若源页面行为不完整，计划文件或任务卡必须写清楚新 Toolars 行为定义。
期望：FAIL

### Step 6: 迁移 VitalCalc blog 内容

⏱ ~ 5 min per article/data slice

测试先写：
- `sites/toolars/src/data/blog.test.ts`
- `sites/toolars/src/app/[locale]/blog/[slug]/page.test.tsx`

实现：
- 把 VitalCalc 20 篇 blog 转成 Toolars blog 数据模型。
- 保留现有 3 篇 Toolars 自有文章，最终英文 article count 至少 23。
- 为每篇文章映射 `featuredToolSlugs`，所有 slug 必须存在于 registry。
- Blog 页面 UI 继续使用 Toolars blog index/article 模板；不移植 Astro 布局。
- 修复当前硬编码：
  - `Open tool`
  - `min read`
  - metadata title/description 的 locale 版本
  - breadcrumb `Blog`

跑：
```bash
cd sites/toolars
pnpm test -- blog
pnpm typecheck
pnpm build
```

verify: `pnpm test -- blog && pnpm typecheck && pnpm build`
cdc-lint verify: `npm test -- blog`
跑：`pnpm test -- blog && pnpm typecheck && pnpm build`
expected: FAIL first, then PASS；`allArticleSlugs` 包含 20 个 VitalCalc slug，`generateStaticParams` 覆盖完整 blog，所有 mentioned tool 链接有效。
期望：FAIL

### Step 7: 扩展 locale matrix 到源项目完整覆盖

⏱ ~ 5 min per locale/config slice

测试先写：
- `sites/toolars/src/lib/i18n/index.test.ts`
- `sites/toolars/src/lib/i18n/message-coverage.test.ts`

实现：
- `sites/toolars/src/data/locales.ts` 增加 `ar`, `fr`, `hi`, `ja`, `pt`, `ru`。
- 映射：
  - Aixtral `zh-cn` -> Toolars `zh-hans`
  - Aixtral `zh-tw` / VitalCalc `zh-tw` -> Toolars `zh-hant`
  - VitalCalc `zh` 只作为源兼容输入，不作为最终 URL locale，除非产品明确要求
- `sites/toolars/src/i18n/request.ts` 接入新增 message bundle。
- `messages/*.json` 保持结构与 English 完全一致。
- RTL：`ar` 页面需要设置 `dir="rtl"` 并跑浏览器 QA。

跑：
```bash
cd sites/toolars
pnpm test -- i18n message-coverage language-switcher
pnpm typecheck
pnpm build
```

verify: `pnpm test -- i18n message-coverage language-switcher && pnpm typecheck && pnpm build`
cdc-lint verify: `npm test -- i18n message-coverage language-switcher`
跑：`pnpm test -- i18n message-coverage language-switcher && pnpm typecheck && pnpm build`
expected: FAIL first, then PASS；所有 locale 路径可生成；language switcher 不丢路径；RTL 无明显布局破坏。
期望：FAIL

### Step 8: 全量翻译和硬编码文案清理

⏱ ~ 5 min per audit/fix slice

测试先写：
- `sites/toolars/src/lib/i18n/hardcoded-ui-copy.test.ts` 或脚本型 audit test

实现：
- 新增用户可见文案扫描脚本，覆盖 `src/app`, `src/components`, `src/data`, `src/lib`。
- 白名单只允许：代码示例、协议名、品牌名、测试 fixture、非 UI enum。
- 把页面标题、按钮、aria-label、badge、empty state、error、metadata、blog category、tool tag 全部移入 `messages/*.json` 或 locale-aware data layer。
- 更新 `TRANSLATION-REVIEW.md`：
  - 医疗：临床审查状态
  - 法律：合格法律翻译状态
  - 金融：财务术语审查状态
  - AI/security：术语一致性状态

跑：
```bash
cd sites/toolars
pnpm test -- message-coverage hardcoded-ui-copy
pnpm typecheck
pnpm build
```

verify: `pnpm test -- message-coverage hardcoded-ui-copy && pnpm typecheck && pnpm build`
cdc-lint verify: `npm test -- message-coverage hardcoded-ui-copy`
跑：`pnpm test -- message-coverage hardcoded-ui-copy && pnpm typecheck && pnpm build`
expected: FAIL first, then PASS；硬编码用户可见英文只剩白名单；新增 locale 与英文 key 完全对齐。
期望：FAIL

### Step 9: Blog 多语言迁移

⏱ ~ 5 min per locale/article slice

测试先写：
- `sites/toolars/src/data/blog.test.ts`
- `sites/toolars/src/app/[locale]/blog/[slug]/page.test.tsx`

实现：
- 将 VitalCalc 9 locale 的 20 篇 blog 接入 locale-aware 数据源。
- 当前 3 篇 Toolars 自有文章若没有完整翻译，则明确 fallback 策略并在审计里显示。
- `getArticleBySlug(slug, locale)` 不再只支持 `en/es/zh`。
- metadata、FAQ schema、Article schema、breadcrumb schema 都按 locale 输出。

跑：
```bash
cd sites/toolars
pnpm test -- blog json-ld i18n
pnpm typecheck
pnpm build
```

verify: `pnpm test -- blog json-ld i18n && pnpm typecheck && pnpm build`
cdc-lint verify: `npm test -- blog json-ld i18n`
跑：`pnpm test -- blog json-ld i18n && pnpm typecheck && pnpm build`
expected: FAIL first, then PASS；每个 source locale 都能访问 20 篇 VitalCalc blog；缺翻译的 Toolars 自有文章不会伪装成已翻译。
期望：FAIL

### Step 10: 最终 UI/UX release gate

文件：不新增功能，只修 QA 发现的问题。
⏱ ~ 5 min per QA route/fix slice

验证路径最少覆盖：
- `/en`, `/es`, `/ar`, `/zh-hans`, `/zh-hant`
- `/en/explore/ai-security`
- `/en/explore/finance`
- `/en/tools/json-repair`
- 每类 workspace 模板各 1 个代表工具
- `/en/blog`, `/en/blog/what-is-bmi`
- `/ar/blog/what-is-bmi`

跑：
```bash
cd sites/toolars
pnpm test
pnpm typecheck
pnpm build
pnpm run audit:tool-inventory
pnpm run visual:release-gate
```

浏览器 QA：
- desktop 1440x1000
- mobile 390x844
- console error/warn = 0
- 无横向溢出
- 分类、搜索、打开工具、语言切换、blog 链接都可点击

verify: `pnpm test && pnpm typecheck && pnpm build && pnpm run audit:tool-inventory && pnpm run visual:release-gate`
cdc-lint verify: `npm test`
跑：`pnpm test && pnpm typecheck && pnpm build && pnpm run audit:tool-inventory && pnpm run visual:release-gate`
expected: PASS；工具、blog、locale、视觉 gate 全部 PASS。
期望：PASS

## 完成判定

- Aixtral Lab：92/92 config tools 在 registry/detail 中覆盖；所有 public 工具都有 workspace 或清晰的 internal 状态；最终 public migration 不允许缺 lib/workspace。
- VitalCalc：86/86 工具保持覆盖，20/20 source blog 英文覆盖，并完成 source locale blog 覆盖。
- Locale：`ar/en/es/fr/hi/ja/pt/ru/zh-hans/zh-hant` 全部可路由、可构建、message key 对齐。
- 翻译：用户可见 label、button、aria-label、metadata、tool detail、blog、错误/空态都进入 locale data；专业内容审查状态写入 `TRANSLATION-REVIEW.md`。
- UI/UX：所有迁移内容适配 Toolars 当前设计，不复用旧站 UI；visual gate 和 browser QA 通过。
- Evidence：最终 closeout 必须包含 full test/typecheck/build/audit/visual/browser 证据。

## 风险和处理

- 源内容与 Toolars 信息架构不一致：以 Toolars registry/category/workspace 模板为准，源内容只做资料来源。
- 27 个 Aixtral 工具缺 pure logic：先写行为测试和 Toolars spec，再重建逻辑。
- 新增 `ar` RTL 可能破坏布局：单独设 RTL QA gate，不和普通翻译混跑。
- 医疗/法律/金融翻译高风险：机器翻译只能进 draft，不得标记 production-reviewed。
- 一次迁移过大：每批最多 5-8 个工具；每批都必须独立 RED/GREEN、typecheck、build、browser QA。
