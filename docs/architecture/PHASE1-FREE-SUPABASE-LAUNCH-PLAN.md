# Toolars Phase 1 Free Launch And Supabase Plan

日期: 2026-07-06
状态: P0 execution plan
范围: `sites/toolars`

## 1. Phase 1 Scope

Phase 1 不上线 SaaS 付费订阅。

保留:

- Supabase 注册、登录、会话、退出。
- 用户 profile 与 workspace。
- 本地免费工具、公开工具目录、blog、多语言。
- 登录后的收藏、最近使用、基础工作区设置。

下线或改写:

- Pricing 付费套餐购买、升级、客户门户、发票、支付方式。
- Pro/Team 订阅承诺。
- 只展示假状态的 API key、billing、team invite、connected apps 按钮。

后续再进入 Phase 2:

- 付费订阅。
- AI credits 计费。
- 高级导出、批处理、团队协作、API keys。

## 2. P0 Workstreams

### W1. Supabase Foundation

目标: 用 Supabase 替代当前自签 session + 本地 JSON store。

任务:

- [x] 添加 Supabase client/server helpers。
- [x] 增加环境变量: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`；保留 legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` 兼容。
- [x] 建立 `profiles`, `workspaces`, `workspace_members`, `saved_tools`, `recent_tools`, `workspace_settings` 表。
- [x] 为用户私有数据加 RLS、authenticated-only policies 和 RLS/FK 索引。
- [x] 替换 `/api/auth/session`、登录弹窗、退出流程。
- [x] 删除或冻结 `toolars-auth-session-ledger` 和本地 account store 的生产路径。

验收:

- 匿名访问免费工具不需要登录。
- 用户可注册、登录、退出。
- 登录状态跨刷新保持。
- workspace 数据来自 Supabase。
- 生产环境不写 `.next/cache` 作为用户数据库。

### W2. Free Launch Scope Cleanup

目标: 一期 UI 不再误导用户以为已经支持付费订阅。

任务:

- [x] `/pricing` 默认改为免费 Beta / upcoming plans 页面，隐藏购买和升级 CTA。
- [x] `/settings/billing` 默认改为 usage / launch status，隐藏客户门户、发票和支付方式。
- [x] `CoreActionModalButton kind="upgrade"` 改为 Phase 2 waitlist/disabled state，不再排队 fake upgrade。
- [x] `/api/billing/account` 在 free launch 下返回 `410 billing_phase2_parked`，不访问 billing driver/provider，也不暴露客户门户或发票数据。
- robots/sitemap/导航同步 Phase 1 范围。

验收:

- 无可点击的付费购买、客户门户、发票、支付方式按钮。
- 全部 launch locale 下付费文案一致。
- 免费工具卡不再显示不准确的 freemium/paid 承诺。

### W3. Runtime I18n And Locale Gate

目标: 静态 i18n audit 之外增加真实浏览器门禁。

任务:

- 新增 Playwright runtime i18n smoke: 打开核心 routes，监听 console/pageerror。
- 检查 `MISSING_MESSAGE`、locale 丢失、语言切换后 path 丢失。
- 覆盖 `en`, `es`, `zh-hans`, `zh-hant`。
- 把 `/submit` 禁用跳转、settings 子页、tool detail、blog detail 纳入必测。

验收:

- 运行时 console error 为 0。
- 所有禁用路由保持当前 locale fallback。
- Draft locale 不进 sitemap、语言菜单和公开路由。

### W4. Button Behavior Certification

目标: 所有可见按钮要么有真实行为，要么明确不可用/后续开放。

任务:

- [x] 扫描没有 `onClick`、`disabled`、`formAction` 或表单提交语义的按钮。
- [x] 给第一批无行为按钮补禁用态，避免假可点击。
- [x] 新增 `audit:button-behavior` release gate，并接入 `launch:readiness`。
- 对 settings、collections、workflows、PDF toolkit、AI tools 优先处理。
- 把本地-only 状态和 Supabase 持久化状态区分清楚。

验收:

- 不存在用户可点击后无反馈的主要按钮。
- 登录后收藏、最近使用、设置能持久化到 Supabase。
- 未上线能力显示 Phase 2 状态，不伪装成已完成。

### W5. Tool Launch Certification

目标: 190 个工具不能默认全量公开为“可发版”。

任务:

- [x] 给每个工具增加 `launchCertified` 或等价状态。
- [x] 第一批只公开 certified 工具到首页、分类页、PDF/AI 目录和命令搜索默认入口。
- 未认证工具降为 preview/hidden。
  - [x] sitemap/SEO 发现面只收录 certified 工具。
  - [x] 未认证工具直达页增加 preview/noindex 或隐藏门禁。
- [x] 为 certified 工具补浏览器 smoke: 输入、运行、输出、复制/保存/导出。

验收:

- [x] `audit:tool-inventory` 区分 `public` 与 `certified`。
- [x] 首页、分类、搜索只默认展示 certified 工具。
- [x] 每个 certified 工具至少有一个 Playwright 主流程用例。

进展:

- 2026-07-07: 第一批 `launchCertifiedTools=10`，`publicTools=190`，`publicUncertifiedTools=180`。默认展示入口已切到 certified selector；未认证工具仍保留直达路由和 registry 记录，等待下一批 smoke/降级策略。
- 2026-07-07: 新增 `smoke:certified-tools` Playwright gate 并接入 `launch:readiness`。10 个 certified 工具主流程 smoke 全部通过，报告目录: `/tmp/toolars-launch-readiness-w5-smoke`。
- 2026-07-08: sitemap 构建改为只收录 `launchCertifiedTools`。`/sitemap.xml` 共 236 个 `<loc>`，包含 `/tools/json-repair`，不包含 `/tools/token-counter`；`launch:route-crawl` 236/236 通过，`smoke:certified-tools` 10/10 通过。
- 2026-07-08: 未认证工具直达页增加 `X-Robots-Tag: noindex, nofollow`，覆盖独立工具页、动态工具页和 about 页；certified 工具不加该 header。production server (`pnpm start`, 9088) 验证: `smoke:certified-tools` 10/10，通过目录 `/tmp/toolars-certified-tool-smoke-w5-prod`；`launch:route-crawl` 236/236，通过目录 `/tmp/toolars-route-crawl-w5-prod`。
- 2026-07-08: 第二批认证完成，`launchCertifiedTools=15`，`publicUncertifiedTools=175`。新增语义 smoke: `token-counter`, `base64-converter`, `password-generator`, `uuid-generator`, `timestamp-converter`。production server (`pnpm start`, 9088) 验证: `smoke:certified-tools` 15/15，通过目录 `/tmp/toolars-certified-tool-smoke-15`。
- 2026-07-08: 第三批认证完成，`launchCertifiedTools=20`，`publicUncertifiedTools=170`。新增语义 smoke: `json-formatter`, `jwt-decoder`, `url-encoder`, `hash-generator`, `regex-tester`。production server (`pnpm start`, 9088) 验证: `smoke:certified-tools` 20/20，通过目录 `/tmp/toolars-certified-tool-smoke-20`。
- 2026-07-08: 第四批认证完成，`launchCertifiedTools=25`，`publicUncertifiedTools=165`。新增语义 smoke: `json-diff`, `csv-to-json`, `json-to-csv`, `yaml-validator`, `xml-formatter`。production server (`pnpm start`, 9088) 验证: `smoke:certified-tools` 25/25，通过目录 `/tmp/toolars-certified-tool-smoke-25`。
- 2026-07-09: 第五批认证完成，`launchCertifiedTools=30`，`publicUncertifiedTools=160`。新增语义 smoke: `markdown-to-json`, `diff-checker`, `text-diff`, `url-parser`, `number-base-converter`。production server (`pnpm start`, 9088) 验证: `smoke:certified-tools` 30/30，通过目录 `/tmp/toolars-certified-tool-smoke-30`。
- 2026-07-10: 第六批认证完成，`launchCertifiedTools=35`，`publicUncertifiedTools=155`。新增语义 smoke: `file-size-converter`, `chmod-calculator`, `ipv4-subnet-calculator`, `user-agent-parser`, `color-converter`。production server (`pnpm start`, 9088) 验证: `smoke:certified-tools` 35/35，通过目录 `/tmp/toolars-certified-tool-smoke-35`。
- 2026-07-10: 第七批认证完成，`launchCertifiedTools=40`，`publicUncertifiedTools=150`。新增语义 smoke: `base64-image-encoder`, `case-converter`, `code-minifier`, `cron-explainer`, `docker-compose-converter`。production server (`pnpm start`, 9088) 验证: `smoke:certified-tools` 40/40，通过目录 `/tmp/toolars-certified-tool-smoke-40`。
- 2026-07-10: 第八批认证完成，`launchCertifiedTools=45`，`publicUncertifiedTools=145`。新增语义 smoke: `html-entity-encoder`, `css-gradient-generator`, `css-border-radius-generator`, `slug-generator`, `text-stats`。production server (`pnpm start`, 9088) 验证: `smoke:certified-tools` 45/45，通过目录 `/tmp/toolars-certified-tool-smoke-45`。
- 2026-07-10: 第九批认证完成，`launchCertifiedTools=50`，`publicUncertifiedTools=140`。新增语义 smoke: `discount-calculator`, `tip-calculator`, `bill-split-calculator`, `hourly-to-salary`, `rule-of-72`。production server (`pnpm start`, 9088) 验证: `smoke:certified-tools` 50/50，通过目录 `/tmp/toolars-certified-tool-smoke-50`。
- 2026-07-11: 第十批认证完成，`launchCertifiedTools=55`，`publicUncertifiedTools=135`。新增语义 smoke: `retirement-calculator`, `roi-calculator`, `apy-calculator`, `savings-goal`, `stock-average`。production server (`pnpm start`, 9088) 验证: `smoke:certified-tools` 55/55，通过目录 `/tmp/toolars-certified-tool-smoke-55`。

### W6. Release Gate Hardening

目标: 浏览器发布门禁必须跑在 production server 上，避免 dev/Turbopack 并发编译噪音影响上线判断。

任务:

- [x] 新增 `scripts/with-production-server.mjs`，按 `--base-url` 启动 `next start -p <port>`，执行目标命令后自动停止。
- [x] `launch:readiness` 的 browser gates 通过 production server wrapper 执行，包括 certified tool smoke、route crawl、language UX smoke、draft locale smoke 和 visual release gate。
- [x] 默认 release report 仍保留原 gate 顺序: test -> typecheck -> build -> audit -> browser smoke -> i18n gates。
- [x] 修复 `--full` CLI 参数解析，确保未显式传 `--browser`/`--visual` 时仍由 `full` 联动开启 browser 和 visual gates。
- [x] GitHub Actions CI 接入 full managed `launch:readiness`，并上传 launch readiness report artifact。
- [x] `launch:readiness` 接入 production health gate，在 `pnpm build` 后用 managed production server 执行 `/api/system/production-health` 检查。

验收:

- [x] `scripts/with-production-server.test.mjs` 覆盖 wrapper 参数解析和 production server 命令生成。
- [x] `launch-readiness-report.test.mjs` 覆盖 production health gate 与 browser gate wrapper 接入。
- [x] `pnpm run --silent launch:readiness -- --base-url http://127.0.0.1:9188 --output /tmp/toolars-launch-readiness-managed-server` 全部通过。
- [x] `pnpm run --silent launch:readiness -- --full --base-url http://127.0.0.1:9188 --output /tmp/toolars-launch-readiness-full-managed-fixed` 全部通过。

进展:

- 2026-07-08: `launch:readiness` 默认链路通过，报告目录 `/tmp/toolars-launch-readiness-managed-server`。摘要: unit tests 534 files / 1662 tests passed，typecheck pass，production build pass，tool inventory pass，managed production certified smoke 10/10 pass，button behavior pass，i18n audit pass，i18n quality audit pass。
- 2026-07-08: 修复 `--full` 未实际触发 browser/visual gates 的解析 bug。full managed release gate 通过，报告目录 `/tmp/toolars-launch-readiness-full-managed-fixed`。摘要: unit tests 534 files / 1663 tests passed，typecheck pass，production build pass，tool inventory pass，certified smoke 10/10 pass，button audit pass，i18n audit pass，i18n quality pass，route crawl 236/236 pass，language UX 4/4 pass，draft locale 3/3 pass，visual release gate pass: mobile 28/28, desktop 4/4, max diff 11.69%。
- 2026-07-08: CI workflow 从分散 `typecheck/test/build` 升级为 `pnpm run launch:readiness -- --full --base-url http://127.0.0.1:9188 --output ../../output/launch-readiness/ci`，先安装 Playwright Chromium，再上传 `output/launch-readiness/ci` artifact。新增 `scripts/ci-workflow.test.mjs` 锁定该发布门禁。
- 2026-07-09: `launch:readiness` 默认和 full 计划新增 `production-health` gate，命令通过 `scripts/with-production-server.mjs` 启动 production server 后执行 `scripts/check-production-health.mjs --base-url <base-url>`。
- 2026-07-09: 默认 `launch:readiness` 带 health gate 全链路通过，报告目录 `/tmp/toolars-launch-readiness-health-gate-fixed`。摘要: unit tests 537 files / 1674 tests passed，typecheck pass，production build pass，production health pass，tool inventory pass，certified smoke 30/30 pass，button behavior pass，i18n audit pass，i18n quality pass。
- 2026-07-10: 默认 `launch:readiness` 按第六批认证口径全链路通过，报告目录 `/tmp/toolars-launch-readiness-35-certified`。摘要: unit tests 537 files / 1674 tests passed，typecheck pass，production build pass，production health pass，tool inventory pass，certified smoke 35/35 pass，button behavior pass，i18n audit pass，i18n quality pass。
- 2026-07-10: 默认 `launch:readiness` 按第七批认证口径全链路通过，报告目录 `/tmp/toolars-launch-readiness-40-certified`。摘要: unit tests 537 files / 1674 tests passed，typecheck pass，production build pass，production health pass，tool inventory pass，certified smoke 40/40 pass，button behavior pass，i18n audit pass，i18n quality pass。
- 2026-07-10: 默认 `launch:readiness` 按第八批认证口径全链路通过，报告目录 `/tmp/toolars-launch-readiness-45-certified`。摘要: unit tests 537 files / 1674 tests passed，typecheck pass，production build pass，production health pass，tool inventory pass，certified smoke 45/45 pass，button behavior pass，i18n audit pass，i18n quality pass。
- 2026-07-10: 默认 `launch:readiness` 按第九批认证口径全链路通过，报告目录 `/tmp/toolars-launch-readiness-50-certified`。摘要: unit tests 537 files / 1674 tests passed，typecheck pass，production build pass，production health pass，tool inventory pass，certified smoke 50/50 pass，button behavior pass，i18n audit pass，i18n quality pass。
- 2026-07-11: 默认 `launch:readiness` 按第十批认证口径全链路通过，报告目录 `/tmp/toolars-launch-readiness-55-certified`。摘要: unit tests 537 files / 1674 tests passed，typecheck pass，production build pass，production health pass，tool inventory pass，certified smoke 55/55 pass，button behavior pass，i18n audit pass，i18n quality pass。

### W7. Production Supabase And Env Health Gate

目标: 发布前必须验证真实部署环境满足 Phase 1 免费上线范围，不能只依赖本地 build/smoke 通过。

任务:

- [x] 新增 `scripts/check-production-health.mjs`，读取 `/api/system/production-health` 并输出只包含状态和变量名的发布证据，不打印密钥值。
- [x] 新增 `pnpm run release:health -- --base-url <deployment-url>` 入口。
- [x] 默认 Phase 1 语义: Supabase public config 和 Free Trial Mode 是 blocker；AI provider 和 billing provider 在一期免费上线中作为 warning。
- [x] 支持 `--require-ai-provider` 和 `--require-billing-provider`，供后续 AI/付费发布把 provider 缺失升级为 blocker。
- [ ] 在生产/预发平台配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`。
- [ ] 对预发和正式域名各运行一次 `release:health`，将输出附到 release candidate。

验收:

- `pnpm exec vitest run scripts/check-production-health.test.mjs` 通过。
- 本地无 Supabase env 时 `release:health` 必须失败并列出 Supabase blocker。
- 预发/正式部署必须返回 `Status: pass`，且 warning 项被 release owner 明确接受或转为 blocker。

进展:

- 2026-07-08: `check-production-health` 单测 6/6 通过，覆盖 Phase 1 pass、Supabase blocker、AI provider 强制模式、CLI 参数解析、pnpm 参数分隔符和无密钥值报告。
- 2026-07-09: 本地 `.env.local` 配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 后，`pnpm run build` 成功并确认加载 `.env.local`；`pnpm run --silent release:health -- --base-url http://127.0.0.1:9088` 返回 `Status: pass`，blockers 为 `none`，仅保留 `TOOLARS_AI_PROVIDER_ENDPOINT/TOOLARS_AI_PROVIDER_API_KEY` warning。
- 2026-07-10: 预发/生产 URL 预检仍阻塞。仓库和配置中未找到真实部署 URL，仅有占位符和测试 fixture；需要 release owner 提供 `TOOLARS_PREPRODUCTION_URL` 和 `TOOLARS_PRODUCTION_URL` 后，分别执行 `pnpm run --silent release:health -- --base-url <url>` 并附证据。

### W8. Public Tool Workspace Browser Smoke

目标: 在完整语义认证前，先确保所有 public 工具独立工作台 route 都能在 production server 中打开，并呈现真实 workspace 容器与交互控件。

任务:

- [x] 新增 `scripts/public-tool-workspace-smoke.mjs`，基于 inventory audit 生成 190 个 public tool workspace 场景。
- [x] 每个场景检查 `/tools/<slug>` 导航成功、workspace marker 可见、页面存在可见交互控件、无 console/pageerror。
- [x] 新增 `pnpm run smoke:public-workspaces` 命令。
- [x] 接入 `launch:readiness -- --full` browser gates，输出 `audits/public-tool-workspace-smoke.json` 和 `browser/public-workspaces/` 报告。
- [ ] 将剩余 135 个 public uncertified 工具逐批升级为 launch-certified 语义 smoke，覆盖真实输入、运行、输出、复制/保存/导出行为。

验收:

- `pnpm exec vitest run scripts/public-tool-workspace-smoke.test.mjs scripts/launch-readiness-report.test.mjs scripts/ci-workflow.test.mjs` 通过。
- `pnpm run --silent smoke:public-workspaces -- --base-url http://127.0.0.1:9088 --concurrency 6 --output-dir /tmp/toolars-public-workspace-smoke-full --write /tmp/toolars-public-workspace-smoke-full/report.json` 通过。

进展:

- 2026-07-08: public workspace browser smoke 全量通过: 190/190。报告目录 `/tmp/toolars-public-workspace-smoke-full`。
- 2026-07-08: certified semantic browser smoke 扩到 15 个工具并全量通过: 15/15。报告目录 `/tmp/toolars-certified-tool-smoke-15`。
- 2026-07-08: certified semantic browser smoke 扩到 20 个工具并全量通过: 20/20。报告目录 `/tmp/toolars-certified-tool-smoke-20`。
- 2026-07-08: certified semantic browser smoke 扩到 25 个工具并全量通过: 25/25。报告目录 `/tmp/toolars-certified-tool-smoke-25`。
- 2026-07-09: certified semantic browser smoke 扩到 30 个工具并全量通过: 30/30。报告目录 `/tmp/toolars-certified-tool-smoke-30`。
- 2026-07-10: certified semantic browser smoke 扩到 35 个工具并全量通过: 35/35。报告目录 `/tmp/toolars-certified-tool-smoke-35`。
- 2026-07-10: certified semantic browser smoke 扩到 40 个工具并全量通过: 40/40。报告目录 `/tmp/toolars-certified-tool-smoke-40`。
- 2026-07-10: certified semantic browser smoke 扩到 45 个工具并全量通过: 45/45。报告目录 `/tmp/toolars-certified-tool-smoke-45`。
- 2026-07-10: certified semantic browser smoke 扩到 50 个工具并全量通过: 50/50。报告目录 `/tmp/toolars-certified-tool-smoke-50`。
- 2026-07-11: certified semantic browser smoke 扩到 55 个工具并全量通过: 55/55。报告目录 `/tmp/toolars-certified-tool-smoke-55`。

## 3. Immediate Next Batch

建议下一批按并行子任务推进:

1. Supabase schema + client helpers。
2. Auth modal 改 Supabase sign in/up/out。
3. Pricing/Billing 免费一期降级。
4. Runtime i18n smoke script。
5. Button behavior audit script。
6. Tool certification status model。
7. Full release mode route crawl / language UX / draft locale / visual gates on managed production server。
8. Production Supabase/env validation and release rollback/monitoring SOP；health CLI 已完成，真实预发/生产环境配置和通过证据仍待补齐。
9. Public workspace route smoke 已完成 190/190；下一步继续把 public uncertified 工具升级为语义级 launch-certified smoke。

## 4. Current P0 Fixes Landed

2026-07-06:

- 修复 `/zh-hans/submit` 禁用时跳到 `/en` 的 locale 丢失问题。
- 修复 `settings/api-keys` 中文运行时 `MISSING_MESSAGE`，组件会将本地化状态规范化为内部 enum。
- 补充对应单元回归测试。
- 落地 W1 第一段: Supabase SSR/client helpers、官方新 key 命名兼容、Phase 1 `profiles/workspaces` migration、RLS policies、RLS/FK 索引和 schema/config 回归测试。

W1 后续状态:

- [x] Settings 页面通过 Supabase-backed `/api/auth/session` hydrate 当前账号，不再直接依赖 legacy `resolveToolarsAuthContext` server session；Supabase payload 没有 legacy `sessionId` 时，会用 `session.provider` 展示当前会话来源。

2026-07-06 后续:

- Auth modal 从自定义 Google OAuth 链接改为 Supabase email/password sign in/sign up。
- Header 账号区新增 Supabase browser session 检测与 sign out。
- `/api/auth/session` 改为 Supabase session status API；legacy POST fake session creation 返回 410。
- 补充 Supabase browser/server auth adapter、session route、modal、header account actions 回归测试。

2026-07-07:

- `/api/billing/account`, `/api/ai/provider-runs`, `/api/ai/consent-audit` 改用 async Supabase-aware API auth context。
- 旧 preview account headers 不再给 API 鉴权，只保留匿名 workspace scoping。
- 本地 JSON account store 与 auth session ledger 在 `NODE_ENV=production` 下禁止写入，生产必须使用 Supabase profiles/session。
- `/api/system/production-health` 改为 Supabase-first 发布门禁: `NEXT_PUBLIC_SUPABASE_URL` + publishable/anon key 是认证必需项，旧 Google OAuth 与自签 session secret 只作为 legacy fallback 观测；本地 account store/auth session ledger 在生产健康状态中标记为 `legacy-disabled`。
- 旧 `/api/auth/google/start` 与 `/api/auth/google/callback` fallback routes 改为 `410 supabase_auth_required`，不再跳转 Google、不再交换 code、不再签发 legacy Toolars session。
- Settings 主页面 hydrate 测试改为真实 Supabase session payload，确认账号 ID、邮箱、`supabase` auth source 和 `supabase` session provider 均能正确展示。

W2 进展:

- Core upgrade modal 显示 Phase 2 waitlist 禁用态，移除 fake `Upgrade request queued`。
- Billing API free launch 门禁落地，默认不再读取 provider/customer portal/invoices。

W4 进展:

- 新增 `scripts/audit-button-behavior.mjs`，发布前扫描 `.tsx/.jsx` 中缺少明确行为语义的 `<button>`。
- 第一批 86 个无行为按钮已降级为 `disabled`，覆盖 settings、collections、workflows、submit、states、admin review、shell、PDF toolkit、prompt injection scanner 和若干核心工具页。
