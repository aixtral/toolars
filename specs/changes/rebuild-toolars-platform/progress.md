# Progress: rebuild-toolars-platform

## 2026-06-15 07:19 - vitalcalc-detail-batch-13

- 已完成：Red -> Green；`pnpm test -- registry tool-details tool-detail-view` 从第十三批 VitalCalc screening registry/detail/static route 缺失失败转为 45 files / 181 tests pass。
- 已完成：补齐 R46 与 Task 48，将 VitalCalc 真实存在的 ADHD Adult Screener、Burnout Assessment、GAD-7 Anxiety、PHQ-9 Depression、PSS-10 Stress、GLP-1 Eligibility 六个 mental-health/eligibility screening 工具接入 Toolars registry 与 `/tools/{slug}/about` 详情页。
- 已完成：第十三批详情继续复用 Local calculation model、VitalCalc source handoff、calculator contract 与 related tools 模板；ADHD/Burnout/GAD-7/PHQ-9/PSS-10/GLP-1 详情保留 screening-only、professional evaluation、self-harm/crisis support、doctor prescription review caveat。
- 已完成：`pnpm test` 45 files / 181 tests pass；`pnpm typecheck` pass；`pnpm build` pass，生成 115 个静态页，`/tools/[slug]/about` 显示 `+78 more paths`。
- 已完成：Browser DOM/console QA 覆盖 ADHD desktop、ADHD -> PHQ-9 related destination、GLP-1 390px mobile；Browser 截图接口超时后用 Playwright CLI 截图兜底；截图：`/tmp/toolars-vitalcalc-adhd-detail-desktop.png`、`/tmp/toolars-vitalcalc-glp1-detail-mobile.png`。
- 阻塞：N/A。
- next session 起手：继续剩余 VitalCalc public detail expansion（body recomposition / HOMA-IR / GLP-1 nutrition / reproductive health / performance calculators），或开始下一个真实 workspace。

## 2026-06-14 21:21 - vitalcalc-detail-batch-12

- 已完成：Red -> Green；`pnpm test -- registry tool-details tool-detail-view` 从第十二批 VitalCalc registry/detail/static route 缺失失败转为 45 files / 177 tests pass。
- 已完成：补齐 R45 与 Task 47，将 VitalCalc 真实存在的 China Social Insurance、Dividend Reinvestment、Mortgage Refinance、Coast FIRE、Fund SIP、Quit Smoking 六个 payroll/investment/refinance/lifestyle 工具接入 Toolars registry 与 `/tools/{slug}/about` 详情页。
- 已完成：第十二批详情继续复用 Local calculation model、VitalCalc source handoff、calculator contract 与 related tools 模板；Social Insurance/Dividend/Mortgage/Coast FIRE/SIP/Smoke-Free 详情保留 payroll policy、tax/market、refinance closing-cost、retirement scenario、fund return、health support caveat。
- 已完成：`pnpm test` 45 files / 177 tests pass；`pnpm typecheck` pass；`pnpm build` pass，生成 109 个静态页，`/tools/[slug]/about` 显示 `+72 more paths`。
- 已完成：Browser DOM/console QA 覆盖 Social Insurance desktop 与 Smoke-Free 390px mobile；Browser 截图/点击接口超时后用 Playwright CLI 截图和直接 related destination `/tools/habit-cost/about` 验证兜底；截图：`/tmp/toolars-vitalcalc-social-insurance-detail-desktop.png`、`/tmp/toolars-vitalcalc-smoke-free-detail-mobile.png`。
- 阻塞：N/A。
- next session 起手：继续剩余 VitalCalc public detail expansion（mortgage-adjacent / wellness / screens / calculators not yet in detail list），或开始下一个真实 workspace。

## 2026-06-14 21:11 - vitalcalc-detail-batch-11

- 已完成：Red -> Green；`pnpm test -- registry tool-details tool-detail-view` 从第十一批 VitalCalc registry/detail/static route 缺失失败转为 45 files / 173 tests pass。
- 已完成：补齐 R44 与 Task 46，将 VitalCalc 真实存在的 Credit Score Simulator、Crypto Tax、Freelance Rate、Subscription Audit、Savings Challenge、City Cost Comparison 六个 life-money/credit/tax/relocation 工具接入 Toolars registry 与 `/tools/{slug}/about` 详情页。
- 已完成：第十一批详情继续复用 Local calculation model、VitalCalc source handoff、calculator contract 与 related tools 模板；Credit/Crypto/Freelance/City Cost 详情保留 official score、tax/legal、pricing、relocation scenario caveat。
- 已完成：`pnpm test` 45 files / 173 tests pass；`pnpm typecheck` pass；`pnpm build` pass，生成 103 个静态页，`/tools/[slug]/about` 显示 `+66 more paths`。
- 已完成：Browser DOM/console QA 覆盖 Credit Score desktop 与 City Cost 390px mobile；验证 City Cost -> Income Tax related-link 点击；Playwright 截图：`/tmp/toolars-vitalcalc-credit-score-detail-desktop.png`、`/tmp/toolars-vitalcalc-city-cost-detail-mobile.png`。
- 阻塞：N/A。
- next session 起手：继续剩余 VitalCalc public detail expansion（social insurance / dividend reinvestment / mortgage refinance / coast FIRE / SIP / smoke-free 等），或开始下一个真实 workspace。

## 2026-06-14 20:58 - vitalcalc-detail-batch-10

- 已完成：Red -> Green；`pnpm test -- registry tool-details tool-detail-view` 从第十批 VitalCalc registry/detail/static route 缺失失败转为 45 files / 169 tests pass。
- 已完成：补齐 R43 与 Task 45，将 VitalCalc 真实存在的 Currency Converter、Percentage Calculator、Stock Average、Credit Card APR、Investment Fee、Investment Goal 六个 finance utility/investment 工具接入 Toolars registry 与 `/tools/{slug}/about` 详情页。
- 已完成：第十批详情继续复用 Local calculation model、VitalCalc source handoff、calculator contract 与 related tools 模板；Currency/Investment/Credit 详情保留 rate freshness、fee drag、APR/investment scenario caveat。
- 已完成：`pnpm test` 45 files / 169 tests pass；`pnpm typecheck` pass；`pnpm build` pass，生成 97 个静态页，`/tools/[slug]/about` 显示 `+60 more paths`。
- 已完成：Browser DOM/console QA 覆盖 Currency desktop 与 Investment Fee 390px mobile；Python Playwright 验证 Currency -> Percentage related-link 点击并截图：`/tmp/toolars-vitalcalc-currency-detail-desktop.png`、`/tmp/toolars-vitalcalc-investment-fee-detail-mobile.png`。
- 阻塞：N/A。
- next session 起手：继续剩余 VitalCalc public detail expansion（credit score / crypto tax / freelance rate / subscription audit / savings challenge / city cost 等），或开始下一个真实 workspace。

## 2026-06-14 18:56 - vitalcalc-detail-batch-9

- 已完成：Red -> Green；`pnpm test -- registry tool-details tool-detail-view` 从第九批 VitalCalc registry/detail/static route 缺失失败转为 45 files / 165 tests pass。
- 已完成：补齐 R42 与 Task 44，将 VitalCalc 真实存在的 Caffeine Safe Limit、Alcohol Metabolism、Blood Sugar / A1C、Drink Calories、Fiber Intake、Steps to Calories 六个 health/lifestyle 工具接入 Toolars registry 与 `/tools/{slug}/about` 详情页。
- 已完成：第九批详情继续复用 Local calculation model、VitalCalc source handoff、calculator contract 与 related tools 模板；Alcohol 和 Blood Sugar 详情保留教育/参考 caveat，不作为驾驶或医疗决策依据。
- 已完成：`pnpm test` 45 files / 165 tests pass；`pnpm typecheck` pass；`pnpm build` pass，生成 91 个静态页，`/tools/[slug]/about` 显示 `+54 more paths`。
- 已完成：Browser DOM/console QA 覆盖 Caffeine desktop 与 Drink Calories 390px mobile；Browser 全页截图接口超时后用 Python Playwright 验证 Caffeine -> Drink Calories related-link 点击并截图：`/tmp/toolars-vitalcalc-caffeine-detail-desktop.png`、`/tmp/toolars-vitalcalc-drink-detail-mobile.png`。
- 阻塞：N/A。
- next session 起手：继续剩余 VitalCalc public detail expansion，优先考虑 finance utility 批次（currency/percentage/stock/credit/investment）或下一个真实 workspace。

## 2026-06-14 18:38 - vitalcalc-detail-batch-8

- 已完成：Red -> Green；`pnpm test -- registry tool-details tool-detail-view` 从第八批 VitalCalc registry/detail/static route 缺失失败转为 45 files / 161 tests pass。
- 已完成：补齐 R41 与 Task 43，将 VitalCalc 真实存在的 Tip Calculator、Bill Split Calculator、Unit Converter、Hourly to Salary、Inflation Calculator、Habit Cost Calculator 接入 Toolars registry 与 `/tools/{slug}/about` 详情页。
- 已完成：第八批详情统一走本地计算模板，包含 4 个 workflow steps、Local calculation model、VitalCalc source handoff、calculator contract，以及只指向已实现详情页的 related tools。
- 已完成：`pnpm test` 45 files / 161 tests pass；`pnpm typecheck` pass；`pnpm build` pass，生成 85 个静态页，`/tools/[slug]/about` 显示 `+48 more paths`。
- 已完成：Browser DOM/console QA、Tip -> Bill Split related-link 点击验证，以及 Python Playwright 桌面/390px 移动端截图：`/tmp/toolars-vitalcalc-tip-detail-desktop.png`、`/tmp/toolars-vitalcalc-unit-detail-mobile.png`。
- 阻塞：N/A。
- next session 起手：继续 remaining VitalCalc health/utility public detail expansion，或进入下一批 workspace/collection 真实交互。

## 2026-06-12 22:30 - analysis-and-red-tests

- 已完成：读取 CDC/Product Design/Frontend/TDD/Verify 相关技能；跑 `cdc-workflow gate --mode standard --root .` 通过。
- 已完成：抽看核心设计稿 `01`, `02`, `03`, `17`, `19`, `45`。
- 已完成：盘点 VitalCalc 当前 86 个工具页；Aixtral Lab 当前 92 个工具配置。
- 进行中：`sites/toolars` 新站骨架；下一步先跑 Red tests。
- 阻塞：N/A。
- next session 起手：读取本文件，然后从 `sites/toolars` 的 failing tests 继续。

## 2026-06-12 23:20 - first-green-slice

- 已完成：`sites/toolars` Next.js + TypeScript + Vitest 新站骨架。
- 已完成：Red -> Green；`pnpm test` 从 3 个缺失模块失败转为 3 files / 12 tests pass。
- 已完成：`pnpm typecheck` pass；`pnpm build` pass，生成 `/`, `/explore/pdf`, `/explore/ai-developer`, `/tools/json-repair`。
- 已完成：Browser DOM QA：首页非空、JSON Repair 点击后输出 `"user": "ada"`、console 无 error/warn；390px 移动 `scrollWidth === viewportWidth`。
- 已修复：桌面 `Menu` 按钮误显示导致 11px 横向溢出。
- 阻塞：Browser 内置截图 `Page.captureScreenshot` 超时；用既有 Playwright 作为截图 fallback，截图在 `/tmp/toolars-*.png`。
- next session 起手：继续第二批 PDF Toolkit workspace 或为 Command Center 增加真实 dialog 交互。

## 2026-06-12 23:47 - pdf-toolkit-slice

- 已完成：Red -> Green；`pnpm test -- pdf-toolkit` 从缺失 `pdf-toolkit` 模块 / workspace 组件失败转为 5 files / 18 tests pass。
- 已完成：实现 PDF Toolkit job planner，覆盖本地 Merge、AI summary consent gate、consent 后摘要输出。
- 已完成：实现 `/tools/pdf-toolkit` 三栏工作台：文件列表、操作选择、结果/预览、AI Enhance consent、Next steps、信任条。
- 已修复：本地操作按钮与 AI summary 生成按钮名称重复导致的可访问查询歧义。
- 阻塞：N/A。

## 2026-06-13 00:18 - command-center-slice

- 已完成：Red -> Green；`pnpm test -- command-center` 从缺失 `command-center` 组件失败转为 6 files / 22 tests pass。
- 已完成：实现真实 Command Center 弹层，支持点击触发、Cmd/Ctrl+K、Esc 关闭、搜索结果、分组、空状态和键盘提示。
- 已完成：Shell 静态搜索按钮替换为 client trigger，仍保留服务端页面主体。
- 已完成：样式对齐 `design/15-toolars-core-modals-board.png` 与 `design/16-toolars-states-board.png` 的桌面/移动 command overlay 结构。
- 阻塞：N/A。

## 2026-06-13 00:49 - prompt-injection-scanner-slice

- 已完成：Red -> Green；`pnpm test -- prompt-injection-scanner` 从缺失 scanner 模块 / workspace 组件失败转为 8 files / 29 tests pass。
- 已完成：实现本地启发式扫描器，覆盖 ignore instructions、role override、system prompt leak、context escape、jailbreak、data exposure。
- 已完成：实现 `/tools/prompt-injection-scanner` 三栏 AI security 工作台：prompt surface、risk report、recommended remediation、local scan profile、AI consent 说明。
- 已修复：风险 badge、低风险摘要与报告行重复文案导致的可访问查询歧义；`Save draft` 改为非破坏性本地保存。
- 阻塞：N/A。
- next session 起手：继续落 LLM Cost Calculator 或 MCP Server Builder 工作台。

## 2026-06-13 01:30 - llm-cost-calculator-slice

- 已完成：Red -> Green；`pnpm test -- llm-cost-calculator` 从缺失 calculator 模块 / workspace 组件失败转为 10 files / 36 tests pass。
- 已完成：实现本地 LLM cost estimator，沿用 VitalCalc Toolars 三档静态费率：Small、Balanced、Premium，单位为每百万 token。
- 已完成：实现 `/tools/llm-cost-calculator` 三栏工作台：cost model、usage inputs、monthly estimate、token mix、review checklist、local scenario save。
- 已完成：默认设计稿样本 2400 / 700 / 180000 + Balanced model 计算为 `$562` 与 `558M` monthly tokens。
- 阻塞：N/A。
- next session 起手：继续落 MCP Server Builder 工作台或 LLM Cost Review workflow。

## 2026-06-13 11:40 - mcp-server-builder-slice

- 已完成：Red -> Green；`pnpm test -- mcp-server-builder` 从缺失 builder 模块 / workspace 组件失败转为 12 files / 43 tests pass。
- 已完成：实现本地 MCP manifest builder，覆盖 tool schema、resource index、OAuth notes、test payload、launch review checks。
- 已完成：实现 `/tools/mcp-server-builder` 三栏工作台：builder stages、server draft、manifest preview、Toolars launch review、local draft save。
- 已完成：默认设计稿样本 `toolars-research-kit` + `search_private_docs` 可生成 1 tool / 1 resource / 1 test payload manifest。
- 阻塞：N/A。
- next session 起手：继续落 LLM Cost Review workflow 或 MCP Tool Launch workflow。

## 2026-06-13 11:58 - llm-cost-review-workflow-slice

- 已完成：Red -> Green；`pnpm test -- llm-cost-review` 从缺失 workflow module / component 失败转为 14 files / 47 tests pass。
- 已完成：实现本地 LLM Cost Review workflow runner，复用 LLM Cost Calculator 默认样本并输出 76% progress、`$562/month`、`558M tokens` 和 smaller-model routing memo。
- 已完成：实现 `/workflows/llm-cost-review` workflow builder 页面：Cost workflow context、Review mode、Cost review canvas、Run preview、Tool chain、Budget policy。
- 已完成：Shell 新增 `sidebarVariant="workflows"`，workflow route 使用 Workflow categories + Filters 侧栏。
- 阻塞：N/A。
- next session 起手：继续落 MCP Tool Launch workflow 或 AI Prompt Hardening workflow。

## 2026-06-13 12:19 - mcp-tool-launch-workflow-slice

- 已完成：Red -> Green；`pnpm test -- mcp-tool-launch` 从缺失 workflow module / component 失败转为 16 files / 51 tests pass。
- 已完成：实现本地 MCP Tool Launch workflow runner，输出 88% progress、`Launch checklist ready`、manifest generated、test payload queued、docs export 和 auth policy notes。
- 已完成：实现 `/workflows/mcp-tool-launch` workflow builder 页面：MCP launch context、Launch target、Launch canvas、Run preview、Tool chain、Review gate。
- 已完成：复用 workflow sidebar / workflow builder 样式，并补 MCP 紫色工具链图标与黄色 review gate。
- 阻塞：N/A。
- next session 起手：继续落 AI Prompt Hardening workflow 或 Lab public tool detail template。

## 2026-06-13 20:38 - ai-prompt-hardening-workflow-slice

- 已完成：Red -> Green；`pnpm test -- ai-prompt-hardening` 从缺失 workflow module / component 失败转为 18 files / 55 tests pass。
- 已完成：实现本地 AI Prompt Hardening workflow runner，输出 82% progress、`Hardening report ready`、3 injection patterns、guardrails 和 red-team variants。
- 已完成：实现 `/workflows/ai-prompt-hardening` workflow builder 页面：AI security context、Input surfaces、Hardening canvas、Run preview、Tool chain、AI deep review consent。
- 已完成：复用 workflow builder 样式，并补 Prompt Injection Scanner / JSON Repair 工具链图标色。
- 阻塞：N/A。
- next session 起手：继续落 Lab public tool detail template 或 PDF Summary workflow。

## 2026-06-13 20:51 - ai-lab-public-detail-template-slice

- 已完成：Red -> Green；`pnpm test -- tool-detail tool-details` 从缺失 detail data / component 失败转为 20 files / 60 tests pass。
- 已完成：实现共享 `tool-details` 数据模型，覆盖 Prompt Injection Scanner、LLM Cost Calculator、MCP Server Builder 三个 AI Developer Lab public listing。
- 已完成：实现 `/tools/[slug]/about` 动态 detail 模板：Public listing header、Open workspace CTA、Overview metrics、How it works、trust section、Implementation handoff、Included collections、Related tools、Recommended workflow。
- 已完成：补充 detail 响应式样式和相关工具 icon 色。
- 阻塞：N/A。
- next session 起手：继续落 PDF Summary workflow 或 Collection detail template。

## 2026-06-13 21:12 - pdf-summary-and-collection-detail-slice

- 已完成：Red -> Green；`pnpm test -- pdf-summary collection-detail collection-details` 从缺失 workflow / collection detail 模块失败转为 24 files / 69 tests pass。
- 已完成：实现本地 PDF Summary workflow runner，输出 72% progress、`Workflow simulated`、本地提取完成与 AI consent gate 等待文案。
- 已完成：实现 `/workflows/pdf-summary` workflow builder 页面：Workflow builder context、Recommended variations、Step canvas、Run preview、Step settings、AI consent is step-scoped。
- 已完成：实现共享 `collection-details` 数据模型和 `/collections/[slug]` 模板，覆盖 PDF Ops Kit 与 AI Developer Lab 的推荐路径、工具、playbooks、notes、workflows included。
- 已完成：Shell 新增 `sidebarVariant="collections"`，collection route 使用 Collection categories + Filters 侧栏。
- 阻塞：N/A。
- next session 起手：继续扩展 collection landing / workflows landing，或把更多 VitalCalc 工具页接入新 registry。

## 2026-06-13 21:38 - workflows-and-collections-index-slice

- 已完成：Red -> Green；`pnpm test -- workflows-index collections-index` 从缺失 index view 组件失败转为 26 files / 73 tests pass。
- 已完成：实现 `/workflows` landing：Reusable automation paths hero、workflow search、Featured workflows、Popular workflow templates、Trending this week、Build from scratch、Workflow trust。
- 已完成：实现 `/collections` landing：Curated stacks hero、Create/Import/Browse actions、Featured collections、All collections、Recently updated、Suggested for you、Create private collection。
- 已完成：两个页面均使用共享 registry 中的 workflows / collections，并保留到 workflow builder / collection detail 的可点击路径。
- 已修复：Workflows trust 右栏说明被压窄、Collections Recently updated 行标题和更新时间挤压的视觉问题。
- 阻塞：N/A。
- next session 起手：继续落 My Tools dashboard / Submit tool / Pricing，或把更多 VitalCalc 工具详情接入模板。

## 2026-06-13 22:38 - my-tools-and-submit-slice

- 已完成：Red -> Green；`pnpm test -- toolars-shell my-tools submit-tool` 从 Submit `pending_review` 多处渲染断言失败转为 29 files / 79 tests pass。
- 已完成：Shell 新增 `sidebarVariant="workspace"` 与 `sidebarVariant="none"`，支持 `/my-tools` 工作区侧栏和 `/submit` 无侧栏表单布局。
- 已完成：实现 `/my-tools` personal workspace dashboard：quick command、KPI、continue timeline、favorites、saved collections、recommended workflows、shared links、storage/extension、team workspace。
- 已完成：实现 `/submit` submission form：Tool basics、Classification、Pricing & processing、Review preview、live listing preview、review checklist、submission timeline、`pending_review` handoff。
- 已验证：Browser QA 覆盖 `/my-tools` 与 `/submit` desktop/mobile、PDF Summary CTA navigation、Submit tool name fill、console 0 warnings/errors、no framework overlay、no horizontal overflow。
- 已说明：Browser 内置截图 `Page.captureScreenshot` 超时，截图证据改用生产预览 `localhost:9321` + Playwright CLI 生成到 `/tmp`。
- 阻塞：N/A。
- next session 起手：继续落 Pricing 或把更多 VitalCalc 工具详情接入模板。

## 2026-06-13 23:37 - pricing-page-slice

- 已完成：Red -> Green；`pnpm test -- pricing toolars-shell` 从缺失 `PricingView` 与 billing shell 失败转为 30 files / 82 tests pass。
- 已完成：实现 `/pricing` plans and billing 页面：pricing hero、Monthly/Yearly toggle、Free/Pro/Team cards、feature comparison、usage estimator、FAQ preview、trust strip。
- 已完成：Shell 新增 `active="pricing"` 与 `sidebarVariant="billing"`，Pricing 主导航仅在 pricing surface 出现，billing sidebar 覆盖 Plans & pricing、Usage、Payment methods、Invoices、Team plans、Upgrade guide。
- 已修复：Browser QA 发现 1280px 桌面 topbar 因 Pricing nav 多 21px 横向溢出；通过 1320px 断点收紧 topbar/nav，并将 pricing layout 切为单列主内容修复。
- 已验证：Browser QA 覆盖 `/pricing` desktop/mobile、billing sidebar、Pricing nav active、Yearly toggle、FAQ interaction、usage defaults、console 0 warnings/errors、no framework overlay、no horizontal overflow。
- 阻塞：N/A。
- 2026-06-14 00:07 +08：完成 Settings / Billing settings 切片。补齐 R18/R19 与 Task 20/21，新增 settings shell variant、`/settings` account settings 页面、`/settings/billing` billing and usage 页面、响应式样式、单元测试与生产预览 QA 截图。
- 2026-06-14 01:15 +08：完成 Admin Review / States Board 切片。补齐 R20/R21 与 Task 22/23，新增 admin shell variant、`/admin/review` 审核台、`/states` 状态板、桌面/移动响应式样式、单元测试与生产预览 QA 截图。
- 2026-06-14 12:40 +08：完成 Settings 子页真实交互切片。补齐 R22/R23 与 Task 24/25，新增 `/settings/privacy-ai` 与 `/settings/api-keys`，实现 consent toggle、API key create/revoke 本地状态、Settings 子页侧栏当前项、桌面/移动响应式样式、单元测试与生产预览 QA 截图。
- 2026-06-14 13:50 +08：完成 Settings 子页第二批切片。补齐 R24/R25/R26 与 Task 26/27/28，新增 `/settings/storage`、`/settings/team`、`/settings/notifications`，实现 temporary upload cleanup、team invite、workflow alert toggle 本地状态，更新 Settings 首页/侧栏真实链接，并完成 Browser DOM QA 与桌面/移动截图。
- 2026-06-14 14:20 +08：完成 Settings 子页第三批切片。补齐 R27/R28 与 Task 29/30，新增 `/settings/connected-apps` 与 `/settings/security`，实现 Notion disconnect/reconnect、2FA toggle、sign out sessions 本地状态，更新 Settings 首页与侧栏真实链接，并完成 Browser DOM QA 与桌面/移动截图。
- 2026-06-14 15:01 +08：完成 Settings 风险确认弹层切片。补齐 R29 与 Task 31，`/settings/security` 的 Sign out all sessions 与 `/settings/connected-apps` 的 Disconnect Notion 现在先打开 `role="dialog"` 确认层，Cancel 不改状态，确认后才执行，并完成 Browser DOM QA 与弹层截图。
- 2026-06-14 15:25 +08：完成 Account Danger Zone Actions 切片。补齐 R30 与 Task 32，`/settings` Danger zone 现在支持 Export data 本地准备状态、Delete account `role="dialog"` 确认层、Cancel no-op 与确认后 queued 状态；完成应用内浏览器 DOM 打开验证与 Python Playwright 桌面/390px 移动端交互 QA，截图：`/tmp/toolars-danger-zone-delete-confirm-desktop.png`、`/tmp/toolars-danger-zone-delete-confirm-mobile.png`。
- 2026-06-14 15:41 +08：完成 VitalCalc Public Tool Detail Expansion 切片。补齐 R31 与 Task 33，新增 Loan Calculator / BMR Calculator 到 VitalCalc registry，`mortgage-calculator`、`bmi-calculator`、`loan-calculator` 现在生成 `/tools/{slug}/about` 详情页；详情模板复用 Local calculation model、Implementation handoff、Related tools，并修复 VitalCalc detail 不再高亮 AI sidebar。完成 Browser DOM QA 与 Python Playwright 桌面/390px 移动端截图：`/tmp/toolars-vitalcalc-mortgage-detail-desktop.png`、`/tmp/toolars-vitalcalc-mortgage-detail-mobile.png`。
- 2026-06-14 15:56 +08：完成 VitalCalc Detail Batch Coverage 切片。补齐 R32 与 Task 34，新增 Retirement Calculator / Debt Payoff Calculator / ROI Calculator / TDEE Calculator / Body Fat Calculator / Protein Calculator 六个 VitalCalc 本地免费工具到 registry，详情静态路径扩到 9 个 VitalCalc `/tools/{slug}/about` 页面；新增共享 `vitalCalcDetail` helper 复用 Local calculation model、VitalCalc source handoff、Related tools 模板，并将第二批 related links 收紧到已实现详情页。完成 Browser DOM QA 与 Python Playwright 桌面/390px 移动端截图：`/tmp/toolars-vitalcalc-tdee-detail-desktop.png`、`/tmp/toolars-vitalcalc-tdee-detail-mobile.png`。
- 2026-06-14 16:56 +08：完成 VitalCalc Related Detail Link Coverage 切片。补齐 R33 与 Task 35，将现有 VitalCalc related cards 中已引用的 Compound Interest Calculator / BMR Calculator / Water Intake Calculator 接入 `/tools/{slug}/about` 详情页，`vitalCalcDetailSlugs` 扩到 12 个 VitalCalc 详情页，并新增测试确保 VitalCalc related tool cards 不再指向缺失详情。完成 Browser DOM QA 的 BMR → Water Intake 点击验证与 Python Playwright 桌面/390px 移动端截图：`/tmp/toolars-vitalcalc-bmr-detail-desktop.png`、`/tmp/toolars-vitalcalc-water-detail-mobile.png`。
- 2026-06-14 17:14 +08：完成 Mortgage Calculator Workspace 切片。补齐 R34 与 Task 36，新增本地 `calculateMortgagePayment` 纯函数与 `/tools/mortgage-calculator` 工作台，支持 Home price / Down payment / Interest rate / Loan term / Property tax / Insurance 输入，输出 monthly payment、total interest、down payment、loan-to-value，并支持 localStorage 保存 scenario。完成 Browser 插件连接与交互尝试；应用内浏览器 locator click 在 CDP `Runtime.evaluate` 超时后，使用 Python Playwright 完成桌面/390px 移动端交互 QA 和截图：`/tmp/toolars-mortgage-workspace-desktop.png`、`/tmp/toolars-mortgage-workspace-mobile.png`。
- 2026-06-14 17:31 +08：完成 BMI Calculator Workspace 切片。补齐 R35 与 Task 37，新增本地 `calculateBmi` 纯函数与 `/tools/bmi-calculator` 工作台，支持 Height / Weight 输入，输出 BMI、reference category、healthy weight range、input summary，并支持 localStorage 保存 profile。完成 Browser DOM/console QA 与 Python Playwright 桌面/390px 移动端计算 + 保存交互 QA，截图：`/tmp/toolars-bmi-workspace-desktop.png`、`/tmp/toolars-bmi-workspace-mobile.png`。
- 2026-06-14 17:42 +08：完成 VitalCalc Detail Batch Expansion 3 切片。补齐 R36 与 Task 38，将原 VitalCalc 中真实存在的 Income Tax / FIRE / Discount / Heart Rate Zone / Sleep / Ideal Weight 六个 finance/health 工具接入 Toolars registry 与 `/tools/{slug}/about` 详情页；共享 Local calculation model、VitalCalc source handoff 与 related tools 模板，并确保 related VitalCalc cards 均指向已实现详情页。完成 Browser DOM/console QA、FIRE → Income Tax related-link 点击验证，以及 Python Playwright 桌面/390px 移动端截图：`/tmp/toolars-vitalcalc-fire-detail-desktop.png`、`/tmp/toolars-vitalcalc-sleep-detail-mobile.png`。
- 2026-06-14 17:49 +08：完成 VitalCalc Detail Batch Expansion 4 切片。补齐 R37 与 Task 39，将原 VitalCalc 中真实存在的 Car Loan / Rent vs Buy / Home Affordability / Waist-Hip Ratio / Blood Pressure / Child Growth 六个 finance/health 工具接入 Toolars registry 与 `/tools/{slug}/about` 详情页；继续复用 Local calculation model、VitalCalc source handoff 与 related tools 模板，并保证 related VitalCalc cards 均指向已实现详情页。完成 Browser DOM/console QA、Rent vs Buy → Home Affordability related-link 点击验证，以及 Python Playwright 桌面/390px 移动端截图：`/tmp/toolars-vitalcalc-rent-buy-detail-desktop.png`、`/tmp/toolars-vitalcalc-blood-pressure-detail-mobile.png`。
- 2026-06-14 17:55 +08：完成 VitalCalc Detail Batch Expansion 5 切片。补齐 R38 与 Task 40，将原 VitalCalc 中真实存在的 Student Loan / APY / Rule of 72 / Calorie Deficit / Macro / Lean Body Mass 六个 finance/health 工具接入 Toolars registry 与 `/tools/{slug}/about` 详情页；继续复用 Local calculation model、VitalCalc source handoff 与 related tools 模板，并保证 related VitalCalc cards 均指向已实现详情页。完成 Browser DOM/console QA、APY → Rule of 72 related-link 点击验证，以及 Python Playwright 桌面/390px 移动端截图：`/tmp/toolars-vitalcalc-apy-detail-desktop.png`、`/tmp/toolars-vitalcalc-macro-detail-mobile.png`。
- 2026-06-14 18:11 +08：完成 VitalCalc Detail Batch Expansion 6 切片。补齐 R39 与 Task 41，将原 VitalCalc 中真实存在的 Emergency Fund / Savings Goal / DTI / Net Worth / Budget Rule / Side Income Tax 六个 finance planning 工具接入 Toolars registry 与 `/tools/{slug}/about` 详情页；继续复用 Local calculation model、VitalCalc source handoff 与 related tools 模板，并保证 related VitalCalc cards 均指向已实现详情页。完成 Browser DOM/console QA、Emergency Fund → Savings Goal related-link 点击验证，以及 Python Playwright 桌面/390px 移动端截图：`/tmp/toolars-vitalcalc-emergency-detail-desktop.png`、`/tmp/toolars-vitalcalc-side-tax-detail-mobile.png`。
- 2026-06-14 18:24 +08：完成 VitalCalc Detail Batch Expansion 7 切片。补齐 R40 与 Task 42，将原 VitalCalc 中真实存在的 Intermittent Fasting / Creatine / VO2 Max / Biological Age / Glycemic Load / 30-30-30 Method 六个 fitness、nutrition、wellness 工具接入 Toolars registry 与 `/tools/{slug}/about` 详情页；继续复用 Local calculation model、VitalCalc source handoff 与 related tools 模板，并保证 related VitalCalc cards 均指向已实现详情页。完成 Browser DOM/console QA、Intermittent Fasting → 30-30-30 Method related-link 点击验证，以及 Python Playwright 桌面/390px 移动端截图：`/tmp/toolars-vitalcalc-fasting-detail-desktop.png`、`/tmp/toolars-vitalcalc-glycemic-detail-mobile.png`。
- next session 起手：继续批量接入剩余 VitalCalc health/utility 详情页，或开始下一个真实 VitalCalc workspace。

## 2026-06-15 22:13 +08 - final-detail-coverage-and-core-modals-slice

- 已完成：补齐 PDF Toolkit / JSON Repair public detail 缺口，`/tools/pdf-toolkit/about` 与 `/tools/json-repair/about` 现在都有 detail data、静态路由、trust section、collection/workflow handoff 与渲染测试。
- 已完成：接入剩余 8 个 VitalCalc 源工具 detail：Body Recomposition、GLP-1 Nutrition、HOMA-IR、1RM、Ovulation、Pregnancy Due Date、Running Pace、Testosterone；VitalCalc registry/detail 覆盖从 78/86 补到 86/86。
- 已完成：实现 Core modals 第二轮共享组件，接入 Tool detail Share、Collection Share/Save collection、Topbar Sign in、Pricing/Workspace Upgrade；弹层均使用 `role="dialog"`、`aria-modal`、明确标题和本地状态反馈。
- 已验证：`pnpm test` 45 files / 191 tests pass；`pnpm typecheck` pass；`pnpm build` pass，SSG 生成 125 pages，`/tools/[slug]/about` 包含 `/tools/pdf-toolkit/about`、`/tools/json-repair/about` 与 `[+88 more paths]`。
- 已验证：Browser QA on `http://localhost:9322` 覆盖 PDF Toolkit detail Share modal、JSON Repair detail、Pregnancy Due Date final VitalCalc detail、PDF Ops Kit Save collection modal、Pricing Upgrade modal、Topbar Sign in modal；截图：`toolars-core-sign-in-modal.png`。
- 阻塞：N/A。
- next session 起手：继续做剩余真实 workspace，或对 Core modals 做移动端/keyboard focus 第二轮 QA。

## 2026-06-16 07:37 +08 - public-detail-workspace-link-safety-slice

- 已完成：补齐 R50 与 Task 52，新增 `/tools/[slug]` 通用 workspace fallback；所有 `allDetailSlugs` 公开详情的 `Open workspace` 现在都有可达落点，现有 PDF / JSON / AI Lab / Mortgage / BMI 专属 workspace 仍保留静态页优先。
- 已完成：新增 `ToolWorkspaceShellView`，复用现有 workspace/detail 设计体系，展示 tool heading、metrics、Local calculation model / Privacy model、workspace path、source handoff、Full calculator path、related tools、Tool details 与 recommended workflow 链接。
- 已完成：按 TDD 先写 Red tests；`pnpm test -- "tools/\\[slug\\]"` 从缺失 `./page` 与 `./tool-workspace-shell-view` 失败转为 47 files / 195 tests pass。
- 已验证：`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，新增 `/tools/[slug]` 包含 `/tools/pdf-toolkit`、`/tools/json-repair`、`/tools/prompt-injection-scanner` 与 `[+88 more paths]`。
- 已验证：Browser DOM/console QA 覆盖 `/tools/loan-calculator`：has shell、Tool details link、Full calculator path、Related tools、无 framework overlay、console 0 error/warn、599px viewport 无横向溢出。Browser 截图通道 `Page.captureScreenshot` 超时后，Playwright CLI 截图保存到 `/tmp/toolars-workspace-fallback-loan-desktop.png` 与 `/tmp/toolars-workspace-fallback-loan-mobile.png`。
- 已验证：Playwright CLI 点击 `/tools/pregnancy-due-date/about` 的 `Open workspace`，落到 `/tools/pregnancy-due-date`，渲染 fallback shell、保留 medical caveat、1280px 无横向溢出、console 0 error/warn。
- 阻塞：N/A。
- next session 起手：继续把高流量 VitalCalc fallback 逐个晋升为真实交互 workspace，优先 Loan / Pregnancy Due Date / Compound Interest / TDEE；或做 Core modals keyboard focus 第二轮 QA。

## 2026-06-16 22:33 +08 - high-traffic-vitalcalc-workspaces-slice

- 已完成：补齐 R51 与 Task 53-56，将 Loan Calculator / Pregnancy Due Date Calculator / Compound Interest Calculator / TDEE Calculator 从通用 fallback 晋升为真实交互 workspace。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并接入现有 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：Loan 支持 principal / APR / term 输入，输出 monthly payment、total interest、total repayment、payments 与 first-year amortization；Pregnancy Due Date 支持 LMP / cycle length，输出 due date、conception estimate、gestational age、trimester、days remaining；Compound Interest 支持 principal / monthly contribution / annual return / years，输出 future value、contributions、interest 与 first-year growth；TDEE 支持 BMR / activity multiplier，输出 TDEE、activity burn、fat-loss target、muscle-gain target。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- loan-calculator pregnancy-due-date compound-interest tdee-calculator` 从 8 个 missing module/component suites 失败转为 55 files / 211 tests pass。
- 已验证：`pnpm test` pass，55 files / 211 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出四个专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、关键结果、`data-tool-workspace`、H1、无 framework overlay、console 0 error/warn、1280px 无横向溢出。Browser 截图通道 `Page.captureScreenshot` 超时后，改用 Playwright Node API 生成桌面与 390px 移动端全页截图到 `output/playwright/toolars-high-traffic-*.png`，8 张截图均无横向溢出。
- 阻塞：N/A。
- next session 起手：继续把下一批高价值 VitalCalc workspace 真实化，或做 Core modals keyboard focus / modal stacking 第二轮 QA。

## 2026-06-16 22:48 +08 - health-nutrition-vitalcalc-workspaces-slice

- 已完成：补齐 R52 与 Task 57-60，将 BMR Calculator / Body Fat Calculator / Protein Calculator / Water Intake Calculator 从通用 fallback 晋升为真实交互 workspace。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：BMR 使用 VitalCalc Mifflin-St Jeor 公式，输出 BMR、maintain、loss、gain targets；Body Fat 使用 VitalCalc US Navy circumference 公式，并补 weight 输入让 fat mass / lean mass 结果真实可用；Protein 使用 kg × activity/goal factor，输出 daily grams、per-meal、egg/chicken equivalents；Water Intake 使用 weight × 35ml + activity/climate adjustment，输出 total、cups、base、activity extra、climate extra。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- bmr-calculator body-fat-calculator protein-calculator water-intake` 从 8 个 missing module/component suites 失败转为 63 files / 227 tests pass。
- 已验证：`pnpm test` pass，63 files / 227 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、关键结果、`data-tool-workspace`、H1、无 framework overlay、console 0 error/warn、1280px 无横向溢出。Browser 批量截图通道 `Page.captureScreenshot` 超时后，改用 Playwright Node API 生成 375 / 768 / 1280 三断点截图到 `output/playwright/toolars-health-*.png`，12 张截图均无横向溢出。
- 阻塞：N/A。
- next session 起手：继续把下一批 VitalCalc workspace 真实化，建议 Calorie Deficit / Macro / Lean Body Mass / Body Recomposition；或回到 Core modals keyboard focus / modal stacking 第二轮 QA。

## 2026-06-16 23:09 +08 - nutrition-planning-vitalcalc-workspaces-slice

- 已完成：补齐 R53 与 Task 61-64，将 Calorie Deficit / Macro Calculator / Lean Body Mass / Body Recomposition 从通用 fallback 晋升为真实交互 workspace。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：Calorie Deficit 使用 VitalCalc `weekly loss × 7700 / 7` 缺口模型，输出 daily deficit、daily intake、timeline weeks、fat to lose；Macro 使用 VitalCalc macro presets 与 high-protein 1.6g/kg 下限，输出 protein/carbs/fat grams；Lean Body Mass 使用 weight 与 body fat percent 输出 lean mass、fat mass、lean ratio；Body Recomposition 使用 Mifflin-St Jeor + activity multiplier，输出 target calories、TDEE、protein、carbs、fat。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- calorie-deficit macro-calculator lean-body-mass body-recomposition` 从 8 个 missing module/component suites 失败转为 71 files / 243 tests pass。
- 已验证：`pnpm test` pass，71 files / 243 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无阻塞弹层、1280px 无横向溢出。Browser 全页截图通道 `Page.captureScreenshot` 超时后，改用 Playwright Node API 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-nutrition-*.png`，12 张截图均无横向溢出且包含默认结果。
- 阻塞：N/A。
- next session 起手：继续把下一批 VitalCalc workspace 真实化，或回到 Core modals keyboard focus / modal stacking 第二轮 QA。

## 2026-06-16 23:24 +08 - finance-planning-vitalcalc-workspaces-slice

- 已完成：补齐 R54 与 Task 65-68，将 Emergency Fund / Savings Goal / Debt Payoff / Retirement Calculator 从通用 fallback 晋升为真实交互 workspace。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：Emergency Fund 使用 VitalCalc `expenses × coverage months` 目标、gap、monthly needed 与 progress；Savings Goal 使用 VitalCalc 600-month capped monthly loop；Debt Payoff 使用 VitalCalc monthly interest/principal loop 与 low-payment guard；Retirement 使用 VitalCalc 4% rule 与 monthly compounding projection。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- emergency-fund savings-goal debt-payoff retirement-calculator` 从 8 个 missing module/component suites 失败转为 79 files / 259 tests pass。
- 已验证：`pnpm test` pass，79 files / 259 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无阻塞弹层、1280px 无横向溢出。Playwright Node API 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-finance-*.png`，12 张截图均无横向溢出且包含默认结果。
- 阻塞：N/A。
- next session 起手：继续把下一批 VitalCalc workspace 真实化，建议 Net Worth / Budget Rule / DTI / APY；或回到 Core modals keyboard focus / modal stacking 第二轮 QA。

## 2026-06-17 07:17 +08 - finance-ratio-yield-vitalcalc-workspaces-slice

- 已完成：补齐 R55 与 Task 69-72，将 Net Worth / Budget Rule / DTI / APY 从通用 fallback 晋升为真实交互 workspace。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：Net Worth 使用 VitalCalc assets minus liabilities 与 debt-to-asset ratio；Budget Rule 使用 income × needs/wants/savings percentages；DTI 使用 front-end / back-end ratio 与 disposable income；APY 使用 `(1 + r/n)^n - 1`，并输出 compounding comparison。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- net-worth-calculator budget-rule dti-calculator apy-calculator` 从 8 个 missing module/component suites 失败转为 87 files / 275 tests pass。
- 已验证：`pnpm test` pass，87 files / 275 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无阻塞弹层、1280px 无横向溢出。Playwright Node API 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-ratio-yield-*.png`，12 张截图均无横向溢出且包含默认结果。
- 阻塞：N/A。
- next session 起手：继续把下一批 VitalCalc workspace 真实化，建议 Tip / Bill Split / Unit Converter / Hourly to Salary；或回到 Core modals keyboard focus / modal stacking 第二轮 QA。

## 2026-06-17 21:59 +08 - everyday-finance-utility-vitalcalc-workspaces-slice

- 已完成：新增 `docs/architecture/CURRENT-STATUS-ROADMAP.md`，统一记录当前 177/177 tasks、27 个专属 workspace、86/86 VitalCalc detail、剩余 non-blocking design gaps 与 Phase 4 生产化路线图。
- 已完成：补齐 R56 与 Task 73-76，将 Tip Calculator / Bill Split Calculator / Unit Converter / Hourly to Salary 从通用 fallback 晋升为真实交互 workspace。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：Tip 使用 bill × tip percent 与 per-person split；Bill Split 使用 subtotal + tip + tax 与 equal/itemized 模式说明；Unit Converter 使用 base-factor 与 temperature offset conversion；Hourly to Salary 使用 regular hours、overtime multiplier、weeks/year 推导 annual/monthly/weekly gross pay。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- tip-calculator bill-split-calculator unit-converter hourly-to-salary` 从 8 个 missing module/component suites 失败转为 95 files / 291 tests pass。
- 已验证：`pnpm test` pass，95 files / 291 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无阻塞弹层、1280px 无横向溢出。旧 9322 dev server 起初无响应，重启后 Browser QA 通过。
- 已验证：Playwright Node API 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-everyday-utility-*.png`，12 张截图均无横向溢出且包含默认结果；已人工查看移动端 Unit Converter 与桌面 Bill Split 截图。
- 阻塞：N/A。
- next session 起手：继续下一批 VitalCalc workspace，建议 Inflation / Habit Cost / Income Tax / Percentage Calculator；或回到 Core modals keyboard focus / modal stacking 第二轮 QA。

## 2026-06-17 23:49 +08 - purchasing-tax-percent-vitalcalc-workspaces-slice

- 已完成：补齐 R57 与 Task 77-80，将 Inflation Calculator / Habit Cost / Income Tax / Percentage Calculator 从通用 fallback 晋升为真实交互 workspace。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.3，当前状态更新为 193/193 tasks、35 个专属 workspace、R57 最新验证基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：Inflation 使用 VitalCalc `amount / (1 + inflationRate)^years` 购买力公式；Habit Cost 使用 weekly spend、annual spend 与普通年金 future value；Income Tax 使用简化 flat-rate taxable income 估算；Percentage 支持 percent-of、ratio percentage、percentage change 三种模式。
- 已完成：根据截图自审补了 Percentage mode / direction 的人类可读标签，避免结果卡暴露内部枚举值。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- inflation-calculator habit-cost income-tax percentage-calculator` 从 8 个 missing module/component suites 失败转为 103 files / 308 tests pass；Percentage label polish 也先跑了小 Red 再 Green。
- 已验证：`pnpm test` pass，103 files / 308 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无阻塞弹层、1280px 无横向溢出。Browser 截图通道 `Page.captureScreenshot` 仍超时，已用 Playwright 截图兜底。
- 已验证：Playwright Node API 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-purchasing-tax-percent-*.png`，12 张截图均无横向溢出且包含默认结果；已人工查看移动端 Percentage 与桌面 Income Tax 截图。
- 阻塞：N/A。
- next session 起手：继续下一批 VitalCalc workspace，建议 Discount / Currency Converter / Stock Average / Credit Card APR；或回到 Core modals keyboard focus / modal stacking 第二轮 QA。

## 2026-06-18 07:21 +08 - shopping-fx-credit-vitalcalc-workspaces-slice

- 已完成：补齐 R58 与 Task 81-84，将 Discount Calculator / Currency Converter / Stock Average Calculator / Credit Card APR 从通用 fallback 晋升为真实交互 workspace。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.4，当前状态更新为 201/201 tasks、39 个专属 workspace、111 files / 324 tests 最新基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：补 `sites/toolars/next.config.ts` 的 `allowedDevOrigins: ["127.0.0.1"]`，修复本地用 `127.0.0.1` 访问 Next dev server 时 HMR 被跨源保护拦截、React hydration 不挂载的问题。
- 已完成：Discount 使用 VitalCalc `original × discount`、折后价、税后 final price；Currency Converter 使用 `amount × exchangeRate` 与手动汇率 freshness caveat；Stock Average 使用 `sum(shares × price) / totalShares` 成本均价；Credit Card APR 使用月手续费现金流 IRR 并年化，默认 0.6% 月费 / 12 期输出约 13.03% true APR。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- discount-calculator currency-converter stock-average credit-card-apr` 从 8 个 missing module/component suites 失败转为 111 files / 324 tests pass。
- 已验证：`pnpm test` pass，111 files / 324 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/discount-calculator`、`/tools/currency-converter`、`/tools/stock-average`、`/tools/credit-card-apr` 四个新增专属 workspace routes。
- 已验证：发现并修复 `127.0.0.1:9322` dev-origin hydration 问题后，In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无阻塞弹层、1280px 无横向溢出。
- 已验证：Playwright Node API 在 `http://127.0.0.1:9322` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-shopping-fx-credit-*.png`，12 张截图均无横向溢出且包含默认结果；已人工查看移动端 Credit Card APR 与桌面 Currency Converter 截图。
- 阻塞：N/A。
- next session 起手：继续下一批 VitalCalc workspace，建议 Investment Fee / Investment Goal / ROI Calculator / Rule of 72；或回到 Core modals keyboard focus / modal stacking 第二轮 QA。

## 2026-06-18 20:23 +08 - investment-planning-vitalcalc-workspaces-slice

- 已完成：补齐 R59 与 Task 85-88，将 Investment Fee / Investment Goal / ROI Calculator / Rule of 72 从通用 fallback 晋升为真实交互 workspace。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.5，当前状态更新为 209/209 tasks、43 个专属 workspace、119 files / 340 tests 最新基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：Investment Fee 使用 VitalCalc no-fee vs with-fee monthly compounding fee-drag 模型；Investment Goal 使用 future-value annuity 反推月投；ROI 使用 `(final value - cost) / cost × 100%`；Rule of 72 使用 `72 / annualRate` shortcut 与 `ln(2) / ln(1+r)` exact doubling time。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- investment-fee investment-goal roi-calculator rule-of-72` 从 8 个 missing module/component suites 失败转为 119 files / 340 tests pass。
- 已验证：`pnpm test` pass，119 files / 340 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/investment-fee`、`/tools/investment-goal`、`/tools/roi-calculator`、`/tools/rule-of-72` 四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无阻塞弹层、1280px 无横向溢出。
- 已验证：Playwright Node API 在 `http://127.0.0.1:9322` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-investment-planning-*.png`，12 张截图均无横向溢出且包含默认结果；已人工查看移动端 Investment Goal 与桌面 Investment Fee 截图。
- 阻塞：N/A。
- next session 起手：继续下一批 VitalCalc workspace，建议 Freelance Rate Calculator / Side Income Tax / Salary Calculator / Social Insurance Calculator；或回到 Core modals keyboard focus / modal stacking 第二轮 QA。

## 2026-06-18 21:59 +08 - work-income-relocation-vitalcalc-workspaces-slice

- 已完成：补齐 R60 与 Task 89-92，将 Freelance Rate / Side Income Tax / City Cost Comparison / Social Insurance Calculator 从通用 fallback 晋升为真实交互 workspace；路线图中的 Salary Calculator 已由 R56 `hourly-to-salary` 覆盖，本批改用同一工作/收入邻域的 City Cost Comparison 保持四件套推进。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.6，当前状态更新为 217/217 tasks、93/93 task sections、47 个专属 workspace、127 files / 356 tests 最新基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：Freelance Rate 使用 VitalCalc 目标收入 + 税费/保险/运营成本 + location factor ÷ billable hours 的 rate floor；Side Income Tax 使用 self-employment taxable income、SE tax、源表 federal bracket base 常数、state flat rate 与 quarterly payment；City Cost 使用简化 federal monthly tax 后的 city surplus 差异；Social Insurance 使用五险一金缴费基数、住房公积金、雇主/雇员缴费和中国月度个税级距。
- 已完成：截图自审发现 Freelance native select 文案在 1280 三列布局中被截断，已缩短选项文案并重新生成断点截图。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- freelance-rate side-income-tax city-cost-comparison social-insurance-calculator` 从 8 个 missing module/component suites 失败转为 127 files / 356 tests pass。
- 已验证：`pnpm test` pass，127 files / 356 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/freelance-rate`、`/tools/side-income-tax`、`/tools/city-cost-comparison`、`/tools/social-insurance-calculator` 四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无阻塞弹层、1280px 无横向溢出；Browser screenshot channel 仍在 `Page.captureScreenshot` 超时，已记录并用 Playwright 截图兜底。
- 已验证：Python Playwright 在 `http://127.0.0.1:9322` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-work-income-*.png`，12 张截图均无横向溢出且包含默认结果；已人工查看移动端 Social Insurance 与桌面 Freelance Rate 截图。
- 阻塞：N/A。
- next session 起手：继续下一批 VitalCalc workspace，建议 FIRE / Coast FIRE / Car Loan / Rent vs Buy；或回到 Core modals keyboard focus / modal stacking 第二轮 QA。

## 2026-06-18 22:24 +08 - fire-housing-auto-vitalcalc-workspaces-slice

- 已完成：补齐 R61 与 Task 93-96，将 FIRE Calculator / Coast FIRE / Car Loan / Rent vs Buy 从通用 fallback 晋升为真实交互 workspace。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.7，当前状态更新为 225/225 tasks、97/97 task sections、51 个专属 workspace、135 files / 372 tests 最新基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：FIRE 使用 VitalCalc 25x annual expenses、annual savings、savings rate 与逐年 compound loop；Coast FIRE 使用未来 FIRE target 折现到当前资产目标；Car Loan 使用贷款额、月利率与等额本息支付公式；Rent vs Buy 使用买房成本、租房成本、down-payment opportunity cost 与分析期内 mortgage payment 对比。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- fire-calculator coast-fire car-loan rent-vs-buy` 从 8 个 missing module/component suites 失败转为 135 files / 372 tests pass，中途修正 FIRE 负储蓄场景断言以匹配源循环仍可能靠现有资产增长达标的行为。
- 已验证：`pnpm test` pass，135 files / 372 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/fire-calculator`、`/tools/coast-fire`、`/tools/car-loan`、`/tools/rent-vs-buy` 四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无阻塞弹层、2560px 无横向溢出。
- 已验证：Python Playwright 在 `http://127.0.0.1:9322` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-fire-housing-auto-*.png`，12 张截图均无横向溢出且包含默认结果；已人工查看移动端 FIRE 与桌面 Rent vs Buy 截图。
- 阻塞：N/A。
- next session 起手：继续下一批 VitalCalc workspace，建议 Home Affordability / Student Loan / Mortgage Refinance / Credit Score Simulator；Mortgage Payoff 源文件不存在，后续不要作为 batch 候选。

## 2026-06-18 22:37 +08 - realestate-debt-credit-vitalcalc-workspaces-slice

- 已完成：补齐 R62 与 Task 97-100，将 Home Affordability / Student Loan / Mortgage Refinance / Credit Score Simulator 从通用 fallback 晋升为真实交互 workspace。
- 已完成：源核对发现 `mortgage-payoff.astro` 不存在于当前 VitalCalc 源目录，Toolars registry/detail 也没有该 slug；本批按源驱动原则改用真实存在的 `credit-score-simulator`，并同步路线图。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.8，当前状态更新为 233/233 tasks、101/101 task sections、55 个专属 workspace、143 files / 388 tests 最新基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：Home Affordability 使用 VitalCalc DTI 上限反推最大月供、贷款额与可负担房价；Student Loan 使用固定利率 PMT 与年度 amortization loop；Mortgage Refinance 使用旧贷/新贷 PMT、总利息差、成本后节省和 break-even；Credit Score 使用 VitalCalc utilization/action weighting 模拟 score impact。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- home-affordability-calculator student-loan-calculator mortgage-refinance-calculator credit-score-simulator` 从 8 个 missing module/component suites 失败转为 143 files / 388 tests pass。
- 已验证：`pnpm test` pass，143 files / 388 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/home-affordability-calculator`、`/tools/student-loan-calculator`、`/tools/mortgage-refinance-calculator`、`/tools/credit-score-simulator` 四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无阻塞弹层、2560px 无横向溢出。
- 已验证：Python Playwright 在 `http://127.0.0.1:9322` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-realestate-credit-*.png`，12 张截图均无横向溢出且包含默认结果；已人工查看移动端 Credit Score 与桌面 Mortgage Refinance 截图。
- 阻塞：N/A。
- next session 起手：继续下一批 VitalCalc workspace，建议 Subscription Audit / Savings Challenge / Dividend Reinvestment / Fund SIP；或回到 Core modals keyboard focus / modal stacking 第二轮 QA。

## 2026-06-18 22:58 +08 - finance-operations-vitalcalc-workspaces-slice

- 已完成：补齐 R63 与 Task 101-104，将 Subscription Audit / Savings Challenge / Dividend Reinvestment / Fund SIP 从通用 fallback 晋升为真实交互 workspace。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.9，当前状态更新为 241/241 tasks、105/105 task sections、59 个专属 workspace、151 files / 404 tests 最新基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：Subscription Audit 使用 VitalCalc 月度归一化频率模型；Savings Challenge 使用 52-week / envelope / no-spend / reverse 四模式；Dividend Reinvestment 使用 after-tax dividend reinvestment 与 no-reinvest comparison；Fund SIP 使用月投 future value annuity 与 zero-return fallback。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- subscription-audit savings-challenge dividend-reinvestment sip-calculator` 从 8 个 missing module/component suites 失败转为 151 files / 404 tests pass。
- 已验证：`pnpm test` pass，151 files / 404 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/subscription-audit`、`/tools/savings-challenge`、`/tools/dividend-reinvestment`、`/tools/sip-calculator` 四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、坐标点击计算/保存按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error、1280px 无横向溢出。
- 已验证：Playwright Node API 在 `http://127.0.0.1:9322` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-finance-ops-*.png`，12 张截图均无横向溢出、localStorage save 断言通过且包含默认结果；已人工查看移动端 Subscription / Savings 与桌面 Dividend / SIP 截图。
- 阻塞：N/A。
- next session 起手：继续下一批 VitalCalc workspace，建议 Health/body metrics follow-up：Waist-Hip Ratio / Blood Pressure / Child Growth / Blood Sugar；或 Lifestyle/safety follow-up：Crypto Tax / Smoke-Free / Caffeine / Alcohol Metabolism。

## 2026-06-18 23:16 +08 - health-body-metrics-vitalcalc-workspaces-slice

- 已完成：补齐 R64 与 Task 105-108，将 Waist-Hip Ratio / Blood Pressure / Child Growth / Blood Sugar 从通用 fallback 晋升为真实交互 workspace。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.10，当前状态更新为 249/249 tasks、109/109 task sections、63 个专属 workspace、159 files / 420 tests 最新基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern。
- 已完成：Waist-Hip Ratio 使用 VitalCalc waist / hip 风险阈值；Blood Pressure 使用 source threshold 分类，默认 120/80 输出 Stage 1；Child Growth 使用源 percentile approximation、BMI 与理想体重区间；Blood Sugar 使用 fasting glucose / A1C / eAG 单位换算与风险提示。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- waist-hip-ratio blood-pressure child-growth blood-sugar-calculator` 从 8 个 missing module/component suites 失败转为 159 files / 420 tests pass，中途将 A1C 6.0 的 eAG 断言校准为源 JS 浮点行为的 125 mg/dL。
- 已验证：`pnpm test` pass，159 files / 420 tests pass；`pnpm typecheck` 在 build 刷新 typed routes 后 pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/waist-hip-ratio`、`/tools/blood-pressure`、`/tools/child-growth`、`/tools/blood-sugar-calculator` 四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、坐标点击计算/保存按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、1280px 无横向溢出。
- 已验证：Playwright Node API 在 `http://127.0.0.1:9322` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-health-body-*.png`，12 张截图均无横向溢出、localStorage save 断言通过且包含默认结果；已人工查看移动端 Child Growth / Blood Sugar 与桌面 Waist-Hip / Blood Pressure 截图。
- 阻塞：N/A。
- next session 起手：继续下一批 VitalCalc workspace，建议 Lifestyle/safety follow-up：Crypto Tax / Smoke-Free / Caffeine / Alcohol Metabolism；或 Remaining lab/nutrition follow-up：Glycemic Load / HOMA-IR / Drink Calories / Fiber Intake。

## 2026-06-19 11:39 +08 - lifestyle-safety-vitalcalc-workspaces-slice

- 已完成：补齐 R65 与 Task 109-112，将 Crypto Tax / Smoke-Free / Caffeine Calculator / Alcohol Metabolism 从通用 fallback 晋升为真实交互 workspace。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.11，当前状态更新为 257/257 tasks、113/113 task sections、67 个专属 workspace、167 files / 436 tests 最新基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern；本批保存键使用 `:v1` 版本化 localStorage。
- 已完成：Crypto Tax 使用 VitalCalc average cost basis、realized PnL 与 unrealized PnL 模型；Smoke-Free 使用 quit-date day diff、money saved、cigarettes avoided、11 minutes per cigarette life-extension estimate 与 recovery milestones；Caffeine 使用 5.7 mg/kg、400 mg adult cap、pregnancy 50% adjustment / 200 mg cap 与 source drink values；Alcohol Metabolism 使用 VitalCalc drink table、Widmark-style source estimate、0.015%/hour metabolism rate 与 impairment bands，并限制 UI timeline 体量避免源码单位放大后产生超长 DOM。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- crypto-tax smoke-free caffeine-calculator alcohol-metabolism` 从 8 个 missing module/component suites 失败转为 167 files / 436 tests pass，中途将 Alcohol BAC 与 fully-metabolized 测试校准为源码数学行为。
- 已验证：`pnpm test` pass，167 files / 436 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/crypto-tax`、`/tools/smoke-free`、`/tools/caffeine-calculator`、`/tools/alcohol-metabolism` 四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、保存按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无可见 framework overlay、1280px 无横向溢出；`nextjs-portal` 仅为空 0x0 节点，非可见 overlay。
- 已验证：Playwright Node API 在 `http://127.0.0.1:9322` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-lifestyle-safety-*.png`，12 张截图均无横向溢出、versioned localStorage save 断言通过且包含默认结果；已人工查看移动端 Alcohol / Crypto 与桌面 Caffeine / Smoke-Free 截图，并收紧 Smoke-Free trust label 文案避免窄卡拥挤。
- 阻塞：N/A。
- next session 起手：继续下一批 VitalCalc workspace，建议 Remaining lab/nutrition follow-up：Glycemic Load / HOMA-IR / Drink Calories / Fiber Intake；或 training/reproductive health follow-up：One Rep Max / Running Pace / Ovulation / Creatine。

## 2026-06-19 11:54 +0800 - lab-nutrition-vitalcalc-workspaces-slice

- 已完成：补齐 R66 与 Task 113-116，将 Glycemic Load / HOMA-IR / Drink Calories / Fiber Intake 从通用 fallback 晋升为真实交互 workspace。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.12，当前状态更新为 265/265 tasks、117/117 task sections、71 个专属 workspace、175 files / 452 tests 最新基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern；本批保存键继续使用 `:v1` 版本化 localStorage。
- 已完成：Glycemic Load 使用 VitalCalc `GI × carbs per serving / 100` 与低/中/高 GL 分段；HOMA-IR 使用 mmol/L 与 uU/mL 标准公式并支持 mg/dL、pmol/L 换算；Drink Calories 使用源饮品 kcal/100ml、sugar/100ml 与 0.05 kcal/step 估算；Fiber Intake 使用体重、性别、年龄调整目标和摄入 gap。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- glycemic-load homa-ir drink-calories fiber-intake` 从 8 个 missing module/component suites 失败转为 175 files / 452 tests pass。
- 已验证：`pnpm test` pass，175 files / 452 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/glycemic-load`、`/tools/homa-ir`、`/tools/drink-calories`、`/tools/fiber-intake` 四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、保存按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无可见 framework overlay、1280px 无横向溢出；Browser 插件只读作用域不暴露 localStorage，因此保存 key 证据由独立 Playwright 补齐。
- 已验证：Playwright Node API 在 `http://127.0.0.1:9322` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-lab-nutrition-*.png`，12 张截图均无横向溢出、versioned localStorage save 断言通过且包含默认结果；已人工查看移动端 Glycemic / HOMA-IR 与桌面 Drink Calories / Fiber Intake 截图。
- 阻塞：N/A。
- next session 起手：继续下一批 VitalCalc workspace，建议 training/reproductive health follow-up：One Rep Max / Running Pace / Ovulation / Creatine；或继续剩余 source-backed public utility follow-up，先核对源文件、registry、public detail 是否齐全。

## 2026-06-19 13:19 +0800 - training-cycle-vitalcalc-workspaces-slice

- 已完成：补齐 R67 与 Task 117-120，将 One Rep Max / Running Pace / Ovulation Calculator / Creatine Calculator 从通用 fallback 晋升为真实交互 workspace。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.13，当前状态更新为 273/273 tasks、121/121 task sections、75 个专属 workspace、183 files / 468 tests 最新基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern；本批保存键继续使用 `:v1` 版本化 localStorage。
- 已完成：1RM 使用 VitalCalc Epley `weight x (1 + reps / 30)` 与百分比训练表；Running Pace 使用目标时间 / 距离、mi pace、400m split 和 Riegel `T2 = T1 x (D2/D1)^1.06` 等效成绩；Ovulation 使用下次月经前 14 天、前 5 天到后 1 天 fertile window；Creatine 使用 0.03g/kg、3-5g cap、intense / vegetarian 调整和可选 20g/day loading。
- 已完成：截图自审发现 1RM 百分比行和 Running equivalent rows 有压字风险、Creatine 原生 select 文案略截断；已改为稳定两列信息行，并缩短 Creatine 训练选项显示文案。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- one-rep-max running-pace ovulation-calculator creatine-calculator` 从 8 个 missing module/component suites 失败转为 183 files / 468 tests pass。
- 已验证：`pnpm test` pass，183 files / 468 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/one-rep-max`、`/tools/running-pace`、`/tools/ovulation-calculator`、`/tools/creatine-calculator` 四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、保存按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无可见 framework overlay、1280px 无横向溢出；Browser screenshot channel `Page.captureScreenshot` 超时，最终截图证据由独立 Playwright 生成。
- 已验证：Playwright Node API 在 `http://127.0.0.1:9322` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-training-cycle-*.png`，12 张截图均无横向溢出、versioned localStorage save 断言通过且包含默认结果；已人工查看移动端 1RM / Ovulation 与桌面 Running Pace / Creatine，并在修正后刷新最终截图集。
- 阻塞：N/A。
- next session 起手：继续剩余 source-backed fitness / health follow-up，先核对 VO2 Max / Heart Rate Zone / Testosterone Calculator / Intermittent Fasting 的源文件、registry、public detail 和互动价值；或切回 Core modals keyboard focus / stacking 第二轮 QA。

## 2026-06-19 13:36 +0800 - cardio-hormone-fasting-vitalcalc-workspaces-slice

- 已完成：补齐 R68 与 Task 121-124，将 VO2 Max / Heart Rate Zone / Testosterone Calculator / Intermittent Fasting 从通用 fallback 晋升为真实交互 workspace。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.14，当前状态更新为 281/281 tasks、125/125 task sections、79 个专属 workspace、191 files / 484 tests 最新基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern；本批保存键继续使用 `:v1` 版本化 localStorage。
- 已完成：VO2 Max 使用 VitalCalc Cooper `(distance - 504.9) / 44.73`、female `0.85` multiplier 与 resting-HR `15.3 * (208 - 0.7 * age) / restingHR`；Heart Rate Zone 使用 Karvonen `resting + (220 - age - resting) * intensity`；Testosterone 保留源站 total T / SHBG 转换、free T estimate 与 negative clamp；Intermittent Fasting 使用 16:8 / 18:6 / 20:4 / 14:10 / OMAD / 5:2 协议窗口。
- 已完成：截图自审发现 VO2 方法名作为大号指标时换行过碎，已缩短为 `Cooper` / `Resting HR`，完整方法名仍保留在 badge 与文案中。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- vo2-max heart-rate-zone testosterone-calculator intermittent-fasting` 从 8 个 missing module/component suites 失败转为 191 files / 484 tests pass。
- 已验证：`pnpm test` pass，191 files / 484 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/vo2-max`、`/tools/heart-rate-zone`、`/tools/testosterone-calculator`、`/tools/intermittent-fasting` 四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、保存按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无可见 framework overlay、1280px 无横向溢出；`nextjs-portal` 仅为空 0x0 节点，非可见 overlay。
- 已验证：Playwright Node API 在 `http://127.0.0.1:9322` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-cardio-hormone-fasting-*.png`，12 张截图均无横向溢出、versioned localStorage save 断言通过且包含默认结果；已人工查看桌面 VO2 与移动端 Testosterone / Intermittent Fasting 截图，并在 VO2 视觉修正后刷新最终截图集。
- 阻塞：N/A。
- next session 起手：继续剩余 source-backed public utility follow-up，先核对源文件、registry、public detail 是否齐全；或切回 Core modals keyboard focus / stacking 第二轮 QA。

## 2026-06-19 13:54 +0800 - sleep-body-activity-vitalcalc-workspaces-slice

- 已完成：补齐 R69 与 Task 125-128，将 Sleep Calculator / Ideal Weight Calculator / Steps to Calories / Biological Age 从通用 fallback 晋升为真实交互 workspace。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.15，当前状态更新为 289/289 tasks、129/129 task sections、83 个专属 workspace、199 files / 500 tests 最新基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern；本批保存键继续使用 `:v1` 版本化 localStorage。
- 已完成：Sleep 使用 VitalCalc 睡眠周期、入睡延迟、咖啡因/屏幕/dinner/morning-light cutoffs；Ideal Weight 使用 Devine formula 与 source rounded ideal weight 的 +/-10% range；Steps 使用源 MET 表、stride 系数和食物等价表，并在按 km/h 估算时将源 stride 距离从 meters 归一到 kilometers；Biological Age 使用源 lifestyle delta rules 并保留 reference-only caveat。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- sleep-calculator ideal-weight-calculator steps-to-calories biological-age` 从 8 个 missing module/component suites 失败转为 199 files / 500 tests pass；中途将 Ideal Weight 上限校准为源 rounded ideal 的 77.7 kg，并将 Sleep 多处 `21:45` 断言改为存在性判断。
- 已验证：`pnpm test` pass，199 files / 500 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/sleep-calculator`、`/tools/ideal-weight-calculator`、`/tools/steps-to-calories`、`/tools/biological-age` 四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、保存按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、1280px 无横向溢出；Browser 插件只读作用域不暴露 localStorage，因此保存 key 证据由独立 Playwright 补齐。
- 已验证：Production Playwright 在 `http://127.0.0.1:9323` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-sleep-body-activity-*.png`，12 张截图均无横向溢出、无可见 framework overlay、versioned localStorage save 断言通过且包含默认结果；已人工查看桌面 Sleep 与移动端 Steps / Biological Age 截图。
- 阻塞：N/A。
- next session 起手：继续剩余 source-backed health-sensitive follow-up，建议先核对 30-30-30 Method / mental-health screeners / GLP-1 tools 的源公式、免责声明、registry 与 public detail 覆盖；或切回 Core modals keyboard focus / stacking 第二轮 QA。

## 2026-06-19 14:21 +0800 - health-sensitive-vitalcalc-workspaces-slice

- 已完成：补齐 R70 与 Task 129-132，将 30-30-30 Method / GLP-1 Eligibility / GLP-1 Nutrition / GAD-7 Anxiety 从通用 fallback 晋升为真实交互 workspace。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.16，当前状态更新为 297/297 tasks、133/133 task sections、87 个专属 workspace、207 files / 516 tests 最新基线。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern；本批保存键继续使用 `:v1` 版本化 localStorage。
- 已完成：30-30-30 使用 VitalCalc 固定 30g protein target 与 `MET * weightKg * 0.5` 的 30 分钟活动消耗估算；GLP-1 Eligibility 使用 BMI、BMI >= 30 或 BMI >= 27 + comorbidity 的 common criteria；GLP-1 Nutrition 使用 Mifflin-St Jeor BMR、activity factor、75% TDEE calorie floor、1.4g/kg protein、35ml/kg water 与 14g/1000kcal fiber floor；GAD-7 使用七题 0-3 频率量表和 minimal / mild / moderate / severe 分段。
- 已完成：健康敏感工具全部加入 reference-only、clinician review、not prescription decision 或 screening-only / not diagnosis caveat；截图自审发现 30-30-30 caveat 不够医疗明确、GAD-7 手机端题干和 select 拥挤，已分别修正文案与 `gad7-question-row` 单列布局。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- 30-30-30-method glp1-eligibility glp1-nutrition gad7-anxiety` 从 8 个 missing module/component suites 失败转为 207 files / 516 tests pass。
- 已验证：`pnpm test` pass，207 files / 516 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/30-30-30-method`、`/tools/glp1-eligibility`、`/tools/glp1-nutrition`、`/tools/gad7-anxiety` 四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、保存按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无可见 framework overlay、1280px 无横向溢出。
- 已验证：Production Playwright 在 `http://127.0.0.1:9323` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-health-sensitive-*.png`，12 张截图均无横向溢出、无可见 framework overlay、versioned localStorage save 断言通过且包含默认结果；GAD-7 375px 额外验证七个问题行均为题干在上、select 在下，并已人工查看移动端 GAD-7 截图。
- 阻塞：N/A。
- next session 起手：继续剩余 source-backed mental-health screeners，建议先核对 PHQ-9 / PSS-10 / ADHD / Burnout 的源评分、免责声明、registry 与 public detail 覆盖；或切回 Core modals keyboard focus / stacking 第二轮 QA。

## 2026-06-19 14:43 +0800 - mental-health-screeners-vitalcalc-workspaces-slice

- 已完成：补齐 R71 与 Task 133-136，将 PHQ-9 Depression / PSS-10 Stress / ADHD Adult Screener / Burnout Assessment 从通用 fallback 晋升为真实交互 workspace。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.17，当前状态更新为 305/305 tasks、137/137 task sections、91 个专属 workspace、215 files / 532 tests 最新基线。
- 已完成：本批补齐后，Toolars 达成 86/86 VitalCalc source tools 的 public detail + dedicated interactive workspace 覆盖；连同 5 个 AI/PDF workspace，总专属 workspace 为 91。
- 已完成：四个 workspace 均新增源驱动纯函数、Vitest 逻辑测试、React UI 测试、专属 `/tools/{slug}` 静态路由，并复用 Toolars shell / workspace panel / Local-first trust pattern；本批保存键继续使用 `:v1` 版本化 localStorage。
- 已完成：PHQ-9 使用 VitalCalc 9 题 0-3 评分、0-4 / 5-9 / 10-14 / 15-19 / 20-27 五档分段，并对第 9 题非零单独暴露 self-harm safety flag；PSS-10 使用 10 题 0-4 评分，并按源逻辑反向计分第 4、5、7、9、10 题；ADHD 使用 ASRS-v1.1 六题、前 3 / 后 3 维度分和 `score >= 2` 的 positive-count，>=4 映射 screening positive；Burnout 使用 10 题 0-4 评分、前 6 题 exhaustion、后 4 题 detachment，以及 0-15 / 16-25 / 26-35 / 36-40 分段。
- 已完成：健康敏感文案均加入 screening-only、not diagnosis、not crisis service、professional evaluation caveat；PHQ-9 特别加入 item 9 urgent support note。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- phq9-depression pss10-stress adhd-screener burnout-assessment` 从 8 个 missing module/component suites 失败转为 215 files / 532 tests pass。
- 已验证：`pnpm test` pass，215 files / 532 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages，并列出 `/tools/phq9-depression`、`/tools/pss10-stress`、`/tools/adhd-screener`、`/tools/burnout-assessment` 四个新增专属 workspace routes。
- 已验证：In-app Browser DOM/console QA 覆盖四个 workspace：真实路由、计算按钮、保存按钮、关键结果、`data-tool-workspace`、H1、Tool details link、console 0 error/warn、无应用可见 framework overlay、1280px 无横向溢出；Browser 只读作用域不暴露 localStorage，因此保存 key 证据由生产 Playwright 补齐。
- 已验证：Production Playwright 在 `http://127.0.0.1:9323` 生成 375 / 768 / 1280 三断点点击后截图到 `output/playwright/toolars-mental-health-*.png`，12 张截图均无横向溢出、无可见 framework overlay、versioned localStorage save 断言通过且包含默认结果；375px 额外验证 screener question rows 均为题干在上、select 在下，并已人工查看移动端 PHQ-9 / ADHD 与桌面 Burnout 截图。
- 阻塞：N/A。
- next session 起手：VitalCalc source-backed workspace 覆盖已完成；建议转入 Phase 3 polish / QA pass（键盘焦点、modal stacking、移动端密度、医疗/心理健康 copy review），或进入 Phase 4 生产化任务（auth persistence、billing、AI provider routing、file storage）。

## 2026-06-19 14:54 +0800 - core-modal-keyboard-focus-stacking-polish

- 已完成：补齐 R72 与 Task 137，将 Share / Save collection / Sign in / Upgrade 的共享 Core action modal 从“可打开”推进到键盘焦点、Escape 关闭、焦点恢复和单 active dialog 的真实弹层契约。
- 已完成：新增 `sites/toolars/src/components/core/core-action-modal.test.tsx`，组件级覆盖 dialog 聚焦、Close 后焦点回到 opener、Escape 关闭、以及多个 Core modal 入口不会叠出两个 `role="dialog"`。
- 已完成：`CoreActionModalButton` 增加 trigger/dialog refs、`aria-expanded`、dialog `tabIndex=-1`、打开后聚焦、Escape document listener、状态清理，以及模块级 active modal closer map；实现保持在共享组件内，未改动各页面入口。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.18，当前状态更新为 307/307 tasks、138/138 task sections、91 个专属 workspace、86/86 VitalCalc source workspace 覆盖、216 files / 535 tests 最新基线。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- core-action-modal` 首轮 3 个新增测试失败，分别命中 dialog 未聚焦、Escape 未关闭 / 未恢复焦点、以及双 Core modal 叠层问题；实现后同命令转为 216 files / 535 tests pass。
- 已验证：`pnpm test` pass，216 files / 535 tests pass；`pnpm typecheck` 首轮捕获 `onClick={close}` handler 类型不匹配，修正为 `onClick={() => close()}` 后 pass；`pnpm build` pass，Next SSG 生成 209 pages。
- 已验证：In-app Browser DOM/console QA 覆盖 `/tools/pdf-toolkit/about` Share、`/collections/pdf-ops-kit` Save collection、`/pricing` Sign in 与 Upgrade：每个入口打开后均为 1 个 labelled `aria-modal` dialog、焦点在 dialog section 上、Escape 后 dialogCount=0 且焦点回到触发按钮；Pricing Pro -> Team 顺序打开保持 1 个 active dialog 且 Team plan 内容出现；console error/warn 均为空。
- 已验证：Browser viewport clipped screenshot 通道可用，完整截图通道在本环境偶发 `Page.captureScreenshot` timeout；本轮核心验收以 DOM/focus/console 自动化证据为准，没有发现应用层可见错误。
- 阻塞：N/A。
- next session 起手：继续 Phase 3 polish，建议优先把同样的 focus/Escape/restore 契约推广到 settings confirmation dialogs、AI consent、Command Center mobile density，再进入 Phase 4 auth / billing / AI routing 生产化。

## 2026-06-19 16:07 +0800 - settings-confirmation-dialog-focus-polish

- 已完成：补齐 R73 与 Task 138，将 Settings / Security / Connected Apps 的 destructive / sensitive confirmation dialogs 提升到与 Core modal 一致的键盘焦点契约。
- 已完成：新增三个页面级回归测试，覆盖 Delete account、Sign out all sessions、Disconnect Notion 三个弹层打开后聚焦 dialog、Escape 关闭、并恢复焦点到实际触发按钮。
- 已完成：新增 `sites/toolars/src/components/core/use-dialog-focus.ts`，提供 dialog/open focus、trigger focus restore、以及多按钮列表场景的 `rememberTrigger`；SettingsView、SecuritySettingsView、ConnectedAppsSettingsView 均接入该 hook。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.19，当前状态更新为 309/309 tasks、139/139 task sections、91 个专属 workspace、86/86 VitalCalc source workspace 覆盖、216 files / 538 tests 最新基线。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- settings-view` 首轮新增 Delete account 测试失败在 dialog 未聚焦；接入 hook 后转绿。随后 `pnpm test -- security-settings-view connected-apps-settings-view` 两个新增测试失败在 dialog 未聚焦；接入同一 hook 后 `pnpm test -- settings-view security-settings-view connected-apps-settings-view` 转为 216 files / 538 tests pass。
- 已验证：`pnpm test` pass，216 files / 538 tests pass；`pnpm build` pass，Next SSG 生成 209 pages；`pnpm typecheck` 与 `pnpm build` 并行时因 `.next/types` 刷新出现一次环境竞态，build 成功后单独重跑 `pnpm typecheck` pass。
- 已验证：In-app Browser DOM/console QA 覆盖 `/settings` Delete account、`/settings/security` Sign out all sessions、`/settings/connected-apps` Disconnect Notion：每个入口打开后均为 1 个 labelled `aria-modal` dialog、焦点在 dialog section 上、Escape 后 dialogCount=0 且焦点回到实际触发按钮；console error/warn 均为空。
- 已验证：Browser QA 检查到 dev-only `nextjs-portal` 为空 0x0 节点，非可见 framework overlay；当前 Browser `Page.captureScreenshot` 在 settings modal 页超时一次，本轮核心验收以 DOM/focus/console 自动化证据为准。
- 阻塞：N/A。
- next session 起手：继续 Phase 3 polish，建议优先处理 AI consent dialog 与 Command Center mobile density / focus trap，再进入 Phase 4 auth / billing / AI provider routing。

## 2026-06-19 16:15 +0800 - ai-consent-dialog-focus-polish

- 已完成：补齐 R74 与 Task 139，将 PDF Toolkit 的 I consent 与 PDF Summary workflow 的 Review consent 从静态状态推进到真实 AI consent dialog、键盘焦点、Escape 关闭、焦点恢复和显式 approval 契约。
- 已完成：新增 `sites/toolars/src/components/core/ai-consent-dialog.tsx`，复用 `use-dialog-focus` 模式，覆盖 `role="dialog"`、`aria-modal`、`tabIndex=-1`、Cancel / Escape close、Approve AI consent、以及 “when / what / deletion and cancel” 三段式 AI consent copy。
- 已完成：PDF Toolkit consent 入口改为先打开弹层，Approve 后才显示 Consent granted；PDF Summary workflow Review consent 入口改为先打开弹层，Approve 后才显示 `Consent reviewed for this workflow step.`。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.20，当前状态更新为 311/311 tasks、140/140 task sections、91 个专属 workspace、86/86 VitalCalc source workspace 覆盖、216 files / 540 tests 最新基线。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- pdf-toolkit-workspace pdf-summary-workflow` 首轮 3 个测试失败，分别命中 PDF Toolkit 旧 consent 入口没有弹层、PDF Summary 旧 Review consent 没有弹层、以及 Approve 后没有 workflow step reviewed 状态；实现后同命令转为 216 files / 540 tests pass。
- 已验证：`pnpm test` pass，216 files / 540 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages。
- 已验证：In-app Browser DOM/focus/console QA 覆盖 `/tools/pdf-toolkit` I consent 与 `/workflows/pdf-summary` Review consent：每个入口打开后均为 1 个 labelled `aria-modal` dialog、焦点在 dialog section 上、包含对应 scoped AI consent copy、Escape 后 dialogCount=0 且焦点回到实际触发按钮、Approve 后进入预期状态；console error/warn 均为空。
- 已验证：Browser clipped screenshot 成功捕获 PDF Toolkit AI consent dialog；QA 结束前已按 Escape 清空弹层，并确认焦点回到 I consent，标签页已 handoff。
- 阻塞：N/A。
- next session 起手：继续 Phase 3 polish，建议优先处理 Command Center mobile density / focus trap；或者开启 Phase 4 生产化里的 AI provider routing / consent audit 数据持久化。

## 2026-06-19 16:26 +0800 - command-center-mobile-focus-trap-polish

- 已完成：补齐 R75 与 Task 140，将 Command Center 从基础键盘搜索推进到 Tab focus trap、Escape / overlay / Esc button 关闭后焦点恢复，以及 390px 移动端密度约束。
- 已完成：新增 `CommandCenter` 回归测试，覆盖 Shift+Tab 从 searchbox 包回最后一个 command result、Tab 从最后一个 result 包回 searchbox、Escape 关闭后焦点回到 Open command search。
- 已完成：`sites/toolars/src/components/search/command-center.tsx` 新增 trigger/dialog refs、统一 open/close 函数、`aria-expanded`、dialog 级 Tab 边界处理和关闭焦点恢复；实现保持在 Command Center 内，未扩大共享 primitive。
- 已完成：`sites/toolars/src/app/globals.css` 将 Command Center dialog 改为三行网格并约束 max-height；390px 手机端移除 72px 顶部偏移、收紧 search row / result / footer spacing，使 results 区域承担内部滚动并保持 footer 可见。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.21，当前状态更新为 313/313 tasks、141/141 task sections、91 个专属 workspace、86/86 VitalCalc source workspace 覆盖、216 files / 542 tests 最新基线。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- command-center` 首轮 2 个新增测试失败，分别命中 Tab 不会包回弹层内、Escape 关闭后焦点落到 body；实现后同命令转为 216 files / 542 tests pass。
- 已验证：`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages。
- 已验证：In-app Browser mobile QA 在 `http://127.0.0.1:9322/`、390x780 视口覆盖 Command Center：打开后 1 个 labelled `aria-modal` dialog，searchbox 聚焦；Shift+Tab 聚焦最后一个 result；Tab 包回 searchbox；Escape 后 dialogCount=0、焦点回到 Open command search、body scroll lock 清空；dialog 370x525 fit in viewport，footer 可见，无横向溢出、无 visible framework overlay、console error/warn 为空。
- 已验证：Browser screenshot 成功捕获 390px Command Center overlay；QA 结束前已按 Escape 清空弹层、reset viewport、finalize 测试标签页。
- 阻塞：N/A。
- next session 起手：继续 Phase 3 polish 可转向未来 file-upload overlays / long-result Command Center stress state；或进入 Phase 4 生产化任务（AI provider routing + consent audit persistence、auth persistence、billing）。

## 2026-06-19 16:44 +0800 - parallel-upload-command-ai-routing-audit-slice

- 已完成：并行探索两条线后补齐 R76 / R77 与 Task 141 / 142：A 线覆盖未来 file-upload overlays 与 long-result Command Center stress；B 线启动 Phase 4 的 AI provider routing + consent audit persistence 本地契约。
- 已完成：PDF Toolkit 的 Add files 现在打开真实本地 upload dialog，使用 `role="dialog"` / `aria-modal`、本地-only 文件 copy、50 MB PDF limit、queued-local 状态、Escape / Cancel close 与焦点恢复；upload copy 明确不等同于 AI consent。
- 已完成：Command Center broad query stress 从默认 8 条提升到 16 条可见结果窗口，`searchCommandResults` 支持 caller-specified limit，移动端 long-result QA 保持 footer 可见、内部滚动和无横向溢出。
- 已完成：PDF Summary 新增 `selectAiProviderRoute` 本地 route contract，Review consent dialog 展示 provider route summary；Approve 后写入 `toolars.ai-consent-audit:v1` versioned localStorage audit log。
- 已完成：Privacy & AI settings 新增本地 audit summary，展示 retained event count、latest workflow、provider label 与 provider route id；Browser QA 首轮抓到 localStorage render-time read 导致 hydration mismatch，已改为 client effect 后读取并复测通过。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.22，当前状态更新为 317/317 tasks、143/143 task sections、91 个专属 workspace、86/86 VitalCalc source workspace 覆盖、218 files / 550 tests 最新基线。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- command-search command-center pdf-toolkit-workspace pdf-summary-workflow privacy-ai-settings provider-routing consent-audit-storage` 首轮失败命中缺失 AI provider/storage 模块、Command Center long-result 默认不足、PDF upload dialog 缺失与 upload guidance 缺失；第二轮将 Command Center stress test 改为真实默认 props 后再次 Red，确认默认仍只有 8 条结果。
- 已验证：实现后同一 targeted suite 转为 218 files / 550 tests pass；hydration 修复后 `pnpm test -- privacy-ai-settings pdf-summary-workflow consent-audit-storage` 继续 218 files / 550 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next SSG 生成 209 pages。
- 已验证：In-app Browser QA 覆盖 `/tools/pdf-toolkit` Add files upload dialog、390px Command Center `calculator` long results、`/workflows/pdf-summary` provider consent、`/settings/privacy-ai` audit summary；最终 console error/warn 为空、无横向溢出，QA 结束前 reset viewport 并 finalize 测试标签页。
- 阻塞：N/A。
- next session 起手：继续 Phase 4 productionization，建议下一步把本地 AI audit log 升级为服务端 audit ledger / run metadata，或把 upload overlay 接到真实 File API、扫描、保留与删除状态。

## 2026-06-19 17:04 +0800 - phase4-server-audit-and-file-upload-production-slice

- 已完成：并行推进 R78 / R79 与 Task 143 / 144，将 Phase 4 两个本地切片继续生产化：AI consent audit 增加 server ledger / run metadata contract，PDF Toolkit upload overlay 接入真实 browser File API lifecycle。
- 已完成：新增 `/api/ai/consent-audit` App Router route，支持 `POST` 写入 versioned server ledger 的 `events` + `runs`，`GET` 返回 ledger；当前为模块级内存 ledger，后续可替换为 durable audit store。
- 已完成：PDF Summary Review consent approve 现在继续写本地 `toolars.ai-consent-audit:v1`，并 fire-and-forget POST server run metadata，metadata 只含 provider route、workflow/step、model family、retention days、content byte count、run id 和 `consent-approved` status，不发送 PDF 内容或 extracted text body。
- 已完成：Privacy & AI settings 在 hydration 后读取 localStorage 与 server audit API，展示本地 retained event count、`Server ledger synced`、server run count、latest run id、model family 和 run status；保持 SSR 首屏稳定，避免 hydration mismatch。
- 已完成：新增 `pdf-upload-lifecycle` 本地 File API mapper，覆盖 stable id、size bytes/MB、estimated pages、scan-passed/rejected、session retention、delete status；PDF Toolkit upload dialog 增加真实 `input[type=file]`、accept/multiple、staged scan results、ready queue add、local delete action 与 aria-live 状态。
- 已完成：Browser QA 在 390px mobile 先抓到 upload dialog footer/button 几何溢出；已通过 grid `minmax(0, 1fr)`、子项 `min-width: 0`、移动端 footer stack 和局部 width 收紧修复，最终 dialog/footer/buttons 均 fit viewport。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.23，当前状态更新为 321/321 tasks、145/145 task sections、91 个专属 workspace、86/86 VitalCalc source workspace 覆盖、220 files / 557 tests 最新基线、210 routes/pages build 基线。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- app/api/ai/consent-audit pdf-summary-workflow privacy-ai-settings pdf-upload-lifecycle pdf-toolkit-workspace` 首轮失败命中缺失 server ledger/API route、PDF Summary 未 POST run metadata、Privacy 未显示 server ledger、PDF Toolkit 没有真实 file input/scan/queue/delete 状态。
- 已验证：实现后同一 targeted suite 转为 220 files / 557 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next build 生成 210 routes/pages，并包含 dynamic `/api/ai/consent-audit`。
- 已验证：In-app Browser QA 覆盖 `/tools/pdf-toolkit` Add files overlay、`/workflows/pdf-summary` consent approve、`GET /api/ai/consent-audit` server ledger、`/settings/privacy-ai` server run metadata，以及 390px mobile upload overlay geometry；最终 console error/warn 为空、无页面横向溢出，QA 结束前 reset viewport 并 finalize 测试标签页。
- 阻塞：N/A。
- next session 起手：继续 Phase 4 productionization，建议下一步把 module-memory server ledger 接 durable storage / account identity / deletion audit，或把 PDF upload lifecycle 接真实 scan worker、temporary file object store 与 PDF Summary file handoff。

## 2026-06-19 17:15 +0800 - privacy-ai-history-export-delete-audit-slice

- 已完成：补齐 R80 与 Task 145，将 Privacy & AI 从只读 server ledger 推进到可操作的 privacy log export、local AI history delete、server deletion audit retained flow。
- 已完成：`/api/ai/consent-audit` 新增 `DELETE`，清空 server ledger 的 `events` / `runs`，并保留包含 deleted counts、timestamp、`ai-history` scope 和 `completed` status 的 deletion audit entry；`GET` 后续继续返回该 deletion entry。
- 已完成：`toolars.ai-consent-audit:v1` localStorage audit storage 新增 `clearAiConsentAuditLog`；Privacy & AI 的 Delete AI history 会先清本地，再调用 server delete route，并把 UI 更新为 0 local events / 0 server runs / 1 deletion request retained。
- 已完成：Download privacy log 现在准备包含 local audit log 与 server ledger 的 JSON 导出，在真实浏览器触发 `toolars-privacy-log-2026-06-19.json` 下载，并显示 export counts 状态。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.24，当前状态更新为 323/323 tasks、146/146 task sections、91 个专属 workspace、86/86 VitalCalc source workspace 覆盖、220 files / 560 tests 最新基线、210 routes/pages build 基线。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- app/api/ai/consent-audit privacy-ai-settings consent-audit-storage` 首轮 3 个新增测试失败，分别命中缺失 `DELETE` route、缺失 `clearAiConsentAuditLog`、Privacy export/delete 按钮未产生状态。
- 已验证：实现后同一 targeted suite 转为 220 files / 560 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next build 生成 210 routes/pages，并包含 dynamic `/api/ai/consent-audit`。
- 已验证：Playwright browser QA 在 `http://127.0.0.1:9321/settings/privacy-ai` 覆盖 server audit seed、本地 localStorage seed、Download privacy log 真实下载、Delete AI history、localStorage cleared、server `GET /api/ai/consent-audit` 只保留 deletion audit；最终 console error/warning 均为 0。
- 阻塞：N/A。
- next session 起手：继续 Phase 4 productionization，建议优先把 module-memory AI audit ledger 接 durable storage / workspace identity，或把 PDF upload lifecycle 接 scan worker / temporary object store / PDF Summary file handoff。

## 2026-06-19 17:27 +0800 - workspace-scoped-ai-audit-store-slice

- 已完成：补齐 R81 与 Task 146，将 `/api/ai/consent-audit` 从 module-memory ledger 推进到 workspace-scoped JSON-backed server audit store。
- 已完成：`server-consent-audit-ledger` 现在按 `workspaceId` 保存 `events`、`runs`、`deletions` 和 version，默认本地运行时路径为 `.next/cache/toolars-ai-consent-audit-ledger.json`；测试可注入临时 store path。
- 已完成：API route 解析 `x-toolars-workspace-id`，`GET` / `POST` / `DELETE` 均只作用于当前 workspace；route 声明 Node.js runtime，filesystem path 参数增加 Turbopack ignore，生产构建不再出现 whole-project NFT tracing warning。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.25，当前状态更新为 325/325 tasks、147/147 task sections、91 个专属 workspace、86/86 VitalCalc source workspace 覆盖、221 files / 563 tests 最新基线、210 routes/pages build 基线。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- app/api/ai/consent-audit server-consent-audit-ledger` 首轮 3 个新增测试失败，命中缺失 JSON store path setter、ledger 未落盘、API 回包没有 workspaceId / header scope。
- 已验证：实现后 `pnpm test -- app/api/ai/consent-audit server-consent-audit-ledger privacy-ai-settings pdf-summary-workflow` 转为 221 files / 563 tests pass；`pnpm typecheck` pass；`pnpm build` pass 且无 Turbopack warnings，Next build 生成 210 routes/pages。
- 已验证：HTTP smoke 在 `http://127.0.0.1:9321/api/ai/consent-audit` 覆盖两个 workspace header：`qa-alpha-clean` 和 `qa-beta-clean` 各自写入 1 run；删除 alpha 后 alpha 为 0 runs / 1 deletion，beta 仍为 1 run / 0 deletions；本轮生成的 `.next/cache/toolars-ai-consent-audit-ledger.json` 已清理，dev server 已停止。
- 阻塞：N/A。
- next session 起手：继续 Phase 4 productionization，建议下一步进入 auth/workspace identity persistence 或把 PDF upload lifecycle 接 scan worker / temporary object store / PDF Summary file handoff。

## 2026-06-19 17:36 +0800 - anonymous-workspace-identity-audit-headers-slice

- 已完成：补齐 R82 与 Task 147，将 server audit workspace scope 接到真实客户端匿名 workspace identity；PDF Summary 与 Privacy & AI 不再落入默认 anonymous server scope。
- 已完成：新增 `toolars.workspace-identity:v1` localStorage identity helper，生成稳定 `toolars_ws_*` workspace id，记录 `createdAt`、`source: anonymous-local`、version，并提供 audit API header helpers。
- 已完成：PDF Summary Review consent approve 的 server audit POST 现在带 `x-toolars-workspace-id`；Privacy & AI 的 server ledger GET 与 Delete AI history 的 DELETE 也带同一个 workspace id。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.26，当前状态更新为 327/327 tasks、148/148 task sections、91 个专属 workspace、86/86 VitalCalc source workspace 覆盖、222 files / 565 tests 最新基线、210 routes/pages build 基线。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- workspace-identity pdf-summary-workflow privacy-ai-settings` 首轮 3 个 suite 因缺失 `workspace-identity` 模块失败，并确认 PDF Summary / Privacy 测试开始要求 workspace header。
- 已验证：实现后 `pnpm test -- workspace-identity pdf-summary-workflow privacy-ai-settings app/api/ai/consent-audit server-consent-audit-ledger` 转为 222 files / 565 tests pass；`pnpm typecheck` pass；`pnpm build` pass 且无 Turbopack warnings，Next build 生成 210 routes/pages。
- 已验证：Playwright request-header QA 在 `http://127.0.0.1:9321` 覆盖 `/workflows/pdf-summary` 和 `/settings/privacy-ai`：Approve AI consent 创建 `toolars.workspace-identity:v1=toolars_ws_20260619093531_87372a8f`，POST / GET / DELETE 均携带同一 `x-toolars-workspace-id`，DELETE response ledger 保留同一 workspaceId；console warning/error 均为 0；本轮生成的 runtime cache 已清理，dev server 已停止。
- 阻塞：N/A。
- next session 起手：继续 Phase 4 productionization，建议下一步把 anonymous workspace identity 绑定到 auth/account persistence，或切 PDF upload scan worker / temporary object store / PDF Summary file handoff。

## 2026-06-19 17:57 +0800 - account-bound-ledger-and-pdf-temp-handoff-slice

- 已完成：补齐 R83 / R84 与 Task 148 / 149，并行推进 anonymous identity -> future account ledger binding，以及 PDF upload scan worker / temp store / Summary handoff。
- 已完成：`toolars.workspace-identity:v1` 支持可选 `accountBinding`，绑定后 audit headers 同时包含 `x-toolars-workspace-id` 和 `x-toolars-account-id`。
- 已完成：`/api/ai/consent-audit` 新增 `PATCH` 账号绑定动作；JSON-backed server ledger 保存 `ServerConsentAccountBinding`，并支持通过 `x-toolars-account-id` 读取 account-scoped aggregate ledger。
- 已完成：新增 `pdf-upload-server-store` JSON-backed temp object store，记录 upload id、workspace id、object key、metadata scan worker、scan status、retention/expiry、handoff token 和 delete status。
- 已完成：新增 `/api/pdf/uploads` Node route，支持 `POST FormData` 注册 File API upload metadata、`GET ?handoff=pdf-summary` 返回当前 workspace ready handoffs、`DELETE` 标记临时对象 deleted。
- 已完成：PDF Toolkit upload overlay 现在先本地 scan，再异步登记 server temp object，并将 staged row 升级为 `Server scan passed`、`Temporary server object` 和 handoff token；PDF Summary workflow 会用 workspace header 读取并显示 Toolkit handoff 文件。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- workspace-identity server-consent-audit-ledger app/api/ai/consent-audit pdf-upload-server-store app/api/pdf/uploads pdf-toolkit-workspace pdf-summary-workflow` 首轮 7 个新增行为失败，命中缺失 account binding、缺失 PDF temp store/route、缺失 Toolkit server registration 和 Summary handoff UI。
- 已验证：实现后同一 suite 转为 224 files / 574 tests pass；`pnpm typecheck` pass；`pnpm build` pass 且无 Turbopack warnings，Next build 生成 211 routes/pages，并包含 dynamic `/api/ai/consent-audit` 与 `/api/pdf/uploads`。
- 已验证：Playwright browser QA 在 `http://127.0.0.1:9321` 覆盖 `/tools/pdf-toolkit` File API 上传到 server temp object、staged row 显示 `Server scan passed` / `Temporary server object` / handoff token、加入 queue 后 `/workflows/pdf-summary` 读取同一 handoff token；console warning/error 为空。
- 已验证：HTTP smoke 覆盖 `/api/ai/consent-audit` account binding：POST workspace run metadata、PATCH 绑定 `acct_http_qa_123`、GET account ledger 返回 `account:acct_http_qa_123`、1 个 binding 和 1 个 run；QA runtime cache 与临时 PDF 已清理，dev server 已停止。
- 阻塞：N/A。
- next session 起手：继续 Phase 4 productionization，建议将 JSON temp object store 接真实对象存储/扫描队列/retention job，并把 account-bound JSON ledger 替换为 authenticated account/workspace database storage。

## 2026-06-19 18:12 +0800 - signed-pdf-handoff-retention-sweep-slice

- 已完成：补齐 R85 与 Task 150，将 PDF temp object handoff 从裸 token 推进到 signed handoff URL，并加入过期 retention sweep 与 deletion audit。
- 已完成：`PdfUploadServerRecord` 现在包含 `signedHandoffUrl`；签名覆盖 workspace id、handoff token、object key 和 expiry，并使用 `TOOLARS_UPLOAD_HANDOFF_SECRET` 或本地默认 secret。
- 已完成：新增 `resolvePdfUploadSignedHandoff`，仅在 workspace 匹配、签名正确、对象 active/ready 且未过期时返回 handoff metadata；tampered signature 或 expired handoff 返回 null。
- 已完成：新增 `PdfUploadDeletionAuditEntry` 与 `listPdfUploadDeletionAudit`；用户删除和 expired sweep 都会保留 deletion audit。
- 已完成：`/api/pdf/uploads` 新增 signed handoff resolve 分支，以及 `DELETE ?sweep=expired&now=...` retention sweep 分支；普通 handoff list 会同时返回 ready uploads 和 deletion audit。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- pdf-upload-server-store app/api/pdf/uploads` 首轮 6 个新增断言失败，命中缺失 `signedHandoffUrl`、signed resolve、deletion audit、expired sweep 和 tamper rejection route。
- 已验证：实现后同一 suite 转为 224 files / 577 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next build 生成 211 routes/pages，并包含 dynamic `/api/ai/consent-audit` 与 `/api/pdf/uploads`。
- 阻塞：N/A。
- next session 起手：继续 Phase 4 productionization，建议把 signed handoff URL 从 metadata resolve 升级为真实 object storage signed URL，或补 storage failure / scan queue retry 状态 UI。

## 2026-06-19 18:25 +0800 - pdf-signed-object-url-storage-retry-slice

- 已完成：补齐 R86 与 Task 151，将 PDF temp object handoff 从 metadata signed URL 继续推进到 signed object-access URL contract，并在 PDF Toolkit upload overlay 增加 server storage failure retry UI。
- 已完成：`PdfUploadServerRecord` 现在包含 `signedObjectUrl`；签名覆盖 workspace id、object key 和 expiry，并在读取旧 JSON temp store 记录时自动补签，保持本地开发缓存兼容。
- 已完成：`PdfUploadItem` 新增 `storageStatus` / `storageLabel` / signed URL 字段；server handoff 成功时标记 `Storage handoff ready`，失败时将可用本地 PDF 标记为 `Storage handoff failed`。
- 已完成：PDF Toolkit upload overlay 现在会保留最近一次 File API 选择和本地 scan 结果，server registration 失败后展示 `Retry upload handoff`，重试成功后用 server scan / temporary object / handoff token metadata 替换失败状态。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.29，当前状态更新为 335/335 tasks、152/152 task sections、91 个专属 workspace、86/86 VitalCalc source workspace 覆盖、224 files / 578 tests 最新基线、211 routes/pages build 基线。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- pdf-upload-server-store app/api/pdf/uploads pdf-toolkit-workspace` 首轮 4 个新增断言失败，命中缺失 `signedObjectUrl`、signed handoff 回包 object access metadata，以及 PDF Toolkit 没有 storage failure / retry UI。
- 已验证：实现后同一 suite 转为 224 files / 578 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next build 生成 211 routes/pages，并包含 dynamic `/api/ai/consent-audit` 与 `/api/pdf/uploads`。
- 阻塞：N/A。
- next session 起手：继续 Phase 4 productionization，建议下一步接真实 object storage read route / scan queue worker / temp object content handoff，或把 AI audit JSON ledger 迁移到 authenticated account/workspace database。

## 2026-06-19 19:50 +0800 - pdf-temp-object-content-read-route-slice

- 已完成：补齐 R87 与 Task 152，将 signed object URL 从 metadata contract 升级为可读取本地 temporary PDF bytes 的 `/api/pdf/uploads/object` route。
- 已完成：`PdfUploadTempCandidate` 支持 `contentBase64`；`registerPdfUploadTempObjects` 对 ready PDF 写入 `.next/cache` 下的 temp content store，并继续用 JSON temp store 保存 metadata / handoff / deletion audit。
- 已完成：新增 `resolvePdfUploadSignedObject`，校验 workspace id、object key、expiry、HMAC signature、active/ready status 和 temp content 是否存在，成功后返回 PDF bytes 与 `application/pdf` content type。
- 已完成：新增 `sites/toolars/src/app/api/pdf/uploads/object/route.ts`，返回 `Content-Type: application/pdf`、`Cache-Control: no-store` 和 inline filename；tampered / wrong workspace / expired / missing content 返回 forbidden。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.30，当前状态更新为 337/337 tasks、153/153 task sections、91 个专属 workspace、86/86 VitalCalc source workspace 覆盖、224 files / 580 tests 最新基线、212 routes/pages build 基线。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- pdf-upload-server-store app/api/pdf/uploads` 首轮失败命中缺失 `resolvePdfUploadSignedObject` 与缺失 `./object/route`。
- 已验证：实现后同一 suite 转为 224 files / 580 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next build 生成 212 routes/pages，并包含 dynamic `/api/ai/consent-audit`、`/api/pdf/uploads` 与 `/api/pdf/uploads/object`。
- 阻塞：N/A。
- next session 起手：继续 Phase 4 productionization，建议下一步把 temp content store 的 delete/sweep 清理、object-read audit、scan queue status 或加密 object storage adapter 拆成下一批 R88。

## 2026-06-19 19:59 +0800 - pdf-temp-content-cleanup-object-audit-slice

- 已完成：补齐 R88 与 Task 153，将本地 PDF temp content store 加上 user delete / expired sweep cleanup，并为 signed object reads 增加 workspace-scoped audit ledger。
- 已完成：`deletePdfUploadTempObject` 和 `sweepExpiredPdfUploadTempObjects` 现在会同步删除 objectKey 对应的 temp content file，避免后续相同 deterministic objectKey 的 metadata-only record 读到旧 bytes。
- 已完成：`PdfUploadTempStore` 新增 `objectAccesses`，并提供 `recordPdfUploadObjectAccess` / `listPdfUploadObjectAccessAudit`；`/api/pdf/uploads/object` 对 granted 和 rejected reads 都写入 audit entry。
- 已完成：`GET /api/pdf/uploads?handoff=pdf-summary` 现在随 ready handoffs 和 deletion audit 一起返回 object access audit，便于后续 Privacy / Storage / worker observability surface 使用。
- 已完成：同步 `docs/architecture/CURRENT-STATUS-ROADMAP.md` 到 v0.31，当前状态更新为 339/339 tasks、154/154 task sections、91 个专属 workspace、86/86 VitalCalc source workspace 覆盖、224 files / 583 tests 最新基线、212 routes/pages build 基线。
- 已验证：按 TDD 先写 Red tests；`pnpm test -- pdf-upload-server-store app/api/pdf/uploads` 首轮 3 个新增测试失败，命中 delete cleanup 未删除旧 content、expired sweep 未删除旧 content、handoff ledger 未返回 `objectAccesses`。
- 已验证：实现后同一 suite 转为 224 files / 583 tests pass；`pnpm typecheck` pass；`pnpm build` pass，Next build 保持 212 routes/pages，并包含 dynamic `/api/ai/consent-audit`、`/api/pdf/uploads` 与 `/api/pdf/uploads/object`。
- 阻塞：N/A。
- next session 起手：继续 Phase 4 productionization，建议下一步拆 R89：scan queue status / content extraction handoff / encrypted object storage adapter 三选一，优先 scan queue status。
