# Toolars 上线前多语言与 UI 验证计划

版本: v0.1
日期: 2026-07-02
范围: `sites/toolars`

## 1. 目标

本计划用于发布前冻结 Toolars 的多语言、语言切换、路由、SEO 和关键 UI 体验。重点不是证明页面“能打开”，而是证明 launch locale 的可见文案、语言切换、路径保持、blog 内容、导航状态和响应式布局都达到可发布标准。

Launch locale:

- `en`
- `es`
- `zh-hans`
- `zh-hant`

Draft locale:

- `ar`
- `fr`
- `hi`
- `ja`
- `pt`
- `ru`

Draft locale 在本次发布中必须继续满足：不进入 sitemap，不进入语言切换，不作为公开路由展示。

## 2. 当前扫描基线

2026-07-02 工程扫描结果:

- `pnpm run audit:i18n`: 通过。message key mismatch 为 0，复制英文字符串为 0，硬编码 UI 文案候选为 0，绝对 href 候选为 0。
- `pnpm run audit:tool-inventory`: `internal-alpha`。公开工具 190/190，workspace/lib 缺口 0/0，硬编码 user-facing UI 字符串 0。
- i18n/语言切换核心测试: 6 个文件，30 个测试通过。
- Blog/SEO/locale 相关测试: 7 个文件，45 个测试通过。
- 语言交互烟测: 4/4 通过，覆盖桌面语言菜单、特殊 locale 路径、桌面分类导航、移动分类和语言菜单。
- Draft locale 非公开烟测: 3/3 通过，覆盖 sitemap、桌面/移动语言菜单、draft 直达路由策略。
- 关键 launch 路由 HTTP sweep: 72/72 通过。

这些结果说明结构和切换机制基本健康，但不能证明翻译质量已经完整。

2026-07-03 增量扫描结果:

- `pnpm run audit:i18n`: 通过。message key mismatch、复制英文字符串、硬编码 UI 文案候选、绝对 href 候选均为 0。
- `pnpm run audit:i18n-quality`: 通过。blocker 与 review item 均为 0。
- Blog localized coverage: `en=23/23, es=23/23, zh-hans=23/23, zh-hant=23/23`。
- Blog content English candidates: `es=0, zh-hans=0, zh-hant=0`。
- Blog `zh-hant` simplified glyph candidates: 0。
- Messages English candidates: `en=0, es=0, zh-hans=0, zh-hant=0`。
- 定向验证: i18n/blog 相关 5 个测试文件 38 个用例通过，`pnpm run typecheck` 通过。

## 3. 当前阻断风险

### P0 / 发布阻断

- 当前 `audit:i18n-quality` 的 P0 blocker 已清零。Blog 结构覆盖已达到 `en=23/23, es=23/23, zh-hans=23/23, zh-hant=23/23`。
- Blog 正文级质量扫描已接入 `audit:i18n-quality`，并覆盖迁移文章的英文残留与 `zh-hant` 繁简混用。当前无 P0 blocker。

### P1 / 发布前必须处理

- `zh-hant` 高置信简体字形候选已清零。正式 `audit:i18n-quality` 当前报告 `zh-hant simplified glyph candidates: 0`。
- 中文 locale 的 messages 英文候选已清零。技术词、品牌词、占位符、示例文件名和结构化值已集中纳入 `audit:i18n-quality` allowlist / strip 规则。
- 西语、简中、繁中 blog 正文英文候选已清零。
- 西语质量不能用简单英文词扫描判断，需要人工审校或更可靠的语言检测策略。

### P2 / 可延后但需要记录

- Draft locale 的 bundle 有内容，但本轮不公开；上线后如果打开第二批 locale，必须重新跑完整质量门禁。
- 示例文件名、快捷键名称、技术词保留规则需要固定成可审计 allowlist。

## 4. 自动化发布门禁

发布前必须在 `sites/toolars` 下按顺序执行:

```bash
pnpm run audit:i18n
pnpm run audit:i18n-quality
pnpm run audit:tool-inventory
pnpm exec vitest run src/lib/i18n/message-coverage.test.ts src/components/shell/language-switcher.test.tsx src/i18n/request.test.ts src/proxy.test.ts 'src/app/[locale]/layout.test.ts' 'src/app/[locale]/not-found.test.tsx'
pnpm exec vitest run src/data/blog.test.ts 'src/app/[locale]/blog/page.test.ts' 'src/app/[locale]/blog/[slug]/page.test.tsx' src/app/sitemap.test.ts src/lib/seo/build-sitemap-entries.test.ts src/lib/i18n/index.test.ts src/lib/i18n/arabic-draft-readiness.test.ts
pnpm run typecheck
pnpm run build
```

浏览器门禁必须对生产构建或当前待发布 server 执行:

```bash
TOOLARS_BASE_URL=http://127.0.0.1:9088 TOOLARS_LANGUAGE_UX_OUTPUT_DIR=/tmp/toolars-language-ux-smoke node scripts/language-ux-smoke.mjs
TOOLARS_BASE_URL=http://127.0.0.1:9088 TOOLARS_DRAFT_LOCALE_SMOKE_OUTPUT_DIR=/tmp/toolars-draft-locale-smoke node scripts/draft-locale-non-public-smoke.mjs
```

路由 sweep 必须覆盖每个 launch locale:

- `/`
- `/explore/pdf`
- `/explore/ai-developer`
- `/explore/finance`
- `/workflows`
- `/collections`
- `/my-tools`
- `/pricing`
- `/blog`
- `/blog/json-repair-guide`
- `/blog/what-is-bmi`
- `/tools/json-repair`
- `/tools/css-flexbox-generator`
- `/tools/pdf-toolkit`
- `/privacy`
- `/terms`
- `/data-rights`
- `/submit`

通过标准:

- 所有 launch 路由返回 2xx 或预期 3xx。
- 任何 launch locale 不得返回 404。
- Draft locale 不得出现在 sitemap、hreflang、桌面语言菜单、移动语言菜单。
- 直接访问 draft locale 必须保持当前策略: redirect 到 `/en/...` 后按非公开路由处理。

## 5. 翻译质量门禁

上线前必须新增或执行等价的质量审计，输出 JSON 报告并保存到临时 evidence 目录。

必检项:

- `messages/*.json` 的 key 完整性为 100%。
- Launch locale 不允许复制英文整句，除 allowlist 中的品牌、技术缩写、单位、键盘按键、变量占位符。
- `zh-hant` 不允许出现明确简体字形，除专有名词或合法原文引用。
- `zh-hans` 与 `zh-hant` 必须分别审校，不得用同一份中文翻译直接复用。
- 西语必须做页面级人工审校抽样，重点检查 shell、footer、pricing、blog、tool card、workspace button/label。
- 所有 allowlist 必须在脚本中集中维护，不能散落在人工结论里。

Blog 内容门禁:

- 如果非英语 blog 公开，则 `es`、`zh-hans`、`zh-hant` 对 23 篇文章的 title、description、sections、faq 覆盖率必须达到 100%。当前结构覆盖已达标。
- 迁移后的 blog 正文必须继续做语言质量审计。当前正文扫描已接入 `audit:i18n-quality`，不得用结构覆盖率替代正文质量验收。
- Blog `zh-hant` 明确简体字形候选必须保持 0；如后续新增文章，需要同脚本复检。
- Blog 列表页和详情页的宽度、正文比例、上一篇/下一篇导航必须在桌面和移动端截图走查。

## 6. UI 走查计划

截图 evidence 默认保存到:

```text
/tmp/toolars-prelaunch-i18n-ui-walkthrough-YYYYMMDD-HHMM/
```

正式归档时再复制到仓库外的发布证据目录；不把临时截图提交进源码仓库。

视口矩阵:

- Desktop: `1440x960`
- Laptop: `1280x832`
- Mobile: `390x844`
- Narrow mobile: `360x780`

每个视口必须检查:

- 页面 identity 正确，title 与当前 locale 一致。
- 首屏不是空白，不出现 Next.js/error overlay。
- Console 无相关 error/pageerror。
- Header active state 与当前页面一致，footer 链接不会误激活 header 菜单。
- 语言切换按钮可打开、可关闭、选项宽度和左右 padding 一致。
- 语言切换只显示 4 个 launch locale。
- 切换语言后 path 保持一致，active option 正确更新。
- 文案不溢出、不重叠、不被 sticky header/footer 遮挡。
- RTL draft locale 不参与本次公开 UI。

必走查页面:

- 首页: `/`, `/es`, `/zh-hans`, `/zh-hant`
- 分类目录: `/explore/pdf`, `/explore/ai-developer`, `/explore/finance`, `/explore/ai-security`
- Blog: `/blog`, `/blog/json-repair-guide`, `/blog/what-is-bmi`
- 工具工作台: `/tools/json-repair`, `/tools/css-flexbox-generator`, `/tools/pdf-toolkit`, `/tools/bmi-calculator`, `/tools/llm-cost-calculator`
- Workflows: `/workflows`, `/workflows/llm-cost-review`, `/workflows/pdf-summary`, `/workflows/ai-prompt-hardening`
- Collections: `/collections` 和至少 2 个 collection detail
- My Tools / Settings: `/my-tools`, `/settings`, `/settings/billing`, `/settings/privacy-ai`
- Pricing / Submit: `/pricing`, `/submit`
- Footer legal: `/privacy`, `/terms`, `/data-rights`
- 404: 每个 launch locale 下的不存在路径

每条走查记录必须包含:

- route
- locale
- viewport
- screenshot 文件名
- language switch before/after URL
- visible untranslated text candidates
- layout issue candidates
- console status
- pass/fail

## 7. Go / No-Go 规则

Go 条件:

- 第 4 节所有自动化命令通过。
- 第 5 节翻译质量门禁无 P0/P1 未处理项。
- 第 6 节 UI 走查无 P0/P1 未处理项。
- `git diff --stat` 只包含本次计划内变更。

No-Go 条件:

- 任一 launch locale 页面 404。
- 语言下拉无法打开、无法选择、切换后 path 丢失。
- Draft locale 出现在公开 sitemap 或语言菜单。
- Header/footer active state 错乱且影响导航判断。
- 中文首屏、工具卡、按钮、label、footer、pricing、blog 出现明显英文 fallback。
- `zh-hant` 可见区域出现明确简体字形。
- Blog 非英语页面大量英文正文 fallback 且未声明。
- 桌面或移动端关键页面出现文字重叠、控件溢出、语言菜单遮挡或无法点击。

## 8. 下一步执行拆分

建议按以下批次推进:

1. 已完成: 建立正式 `audit:i18n-quality` 脚本，把中文英文候选、繁体简体字形、allowlist、blog 覆盖率纳入上线门禁。
2. 已完成: 修复 `zh-hant` 高置信简体字形候选，当前候选数为 0。
3. 已完成: 补齐非英语 blog 结构覆盖，迁移 VitalCalc 20 篇文章到 `es`、`zh-hans`、`zh-hant`，当前覆盖率为 23/23。
4. 已完成: 建立 blog 正文级质量扫描，检查迁移文章的英文残留、繁简混用和术语一致性；当前 blog 英文候选与 blog `zh-hant` 简体字形候选均为 0。
5. 已完成: triage `audit:i18n-quality` 的 messages review 项，补翻译并固化 allowlist / strip 规则；当前质量门禁通过。
6. 下一步: 执行完整 UI 走查截图矩阵，生成本地 evidence 报告。
7. 走查失败项按 P0/P1/P2 分批修复，再重复第 4 节和第 6 节。
